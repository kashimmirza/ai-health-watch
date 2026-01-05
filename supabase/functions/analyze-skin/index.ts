import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  skinCondition: string;
  confidence: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  details: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting skin condition analysis...');

    const systemPrompt = `You are a medical AI assistant specializing in dermatological analysis. Analyze the provided skin image and provide a structured assessment.

IMPORTANT: This is for educational and screening purposes only. Always recommend consulting a healthcare professional for proper diagnosis.

Analyze the image and respond with a JSON object in this exact format:
{
  "skinCondition": "Brief description of what you observe (e.g., 'Healthy skin appearance', 'Possible eczema pattern', 'Minor skin irritation')",
  "confidence": <number between 60-95>,
  "riskLevel": "low" | "medium" | "high",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "details": "A 2-3 sentence detailed explanation of your observations and reasoning"
}

Guidelines:
- Be conservative in assessments - when in doubt, recommend professional consultation
- Focus on visible patterns, texture, color variations, and any anomalies
- Always include a recommendation to see a dermatologist for concerning findings
- If the image is not of skin or is unclear, set riskLevel to "low" and explain in details`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this skin image and provide your assessment in the specified JSON format."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error('Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        console.error('Payment required');
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log('AI response received:', content?.substring(0, 200));

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No analysis result from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON from the response
    let result: AnalysisResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1]?.trim() || content.trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a fallback response
      result = {
        skinCondition: "Analysis completed",
        confidence: 70,
        riskLevel: "low",
        recommendations: [
          "Consult a dermatologist for professional evaluation",
          "Maintain regular skin health monitoring",
          "Use appropriate sun protection"
        ],
        details: content.substring(0, 200)
      };
    }

    // Validate and sanitize the result
    const validatedResult: AnalysisResult = {
      skinCondition: result.skinCondition || "Unable to determine",
      confidence: Math.min(95, Math.max(60, result.confidence || 70)),
      riskLevel: ['low', 'medium', 'high'].includes(result.riskLevel) ? result.riskLevel : 'low',
      recommendations: Array.isArray(result.recommendations) ? result.recommendations.slice(0, 5) : [
        "Consult a healthcare professional for proper diagnosis"
      ],
      details: result.details || "Analysis completed. Please consult a dermatologist for professional evaluation."
    };

    console.log('Returning validated result:', validatedResult.skinCondition);

    return new Response(
      JSON.stringify(validatedResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-skin function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
