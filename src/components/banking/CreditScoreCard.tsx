import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { CreditScore } from '@/types/banking';
import { cn } from '@/lib/utils';

interface CreditScoreCardProps {
  creditScore: CreditScore;
}

const ratingConfig = {
  poor: { color: 'text-destructive', range: '300-579' },
  fair: { color: 'text-warning', range: '580-669' },
  good: { color: 'text-success', range: '670-739' },
  excellent: { color: 'text-primary', range: '740-850' },
};

const factorLabels = {
  paymentHistory: 'Payment History',
  creditUtilization: 'Credit Utilization',
  creditAge: 'Credit Age',
  newCredit: 'New Credit',
  creditMix: 'Credit Mix',
};

export const CreditScoreCard = ({ creditScore }: CreditScoreCardProps) => {
  const config = ratingConfig[creditScore.rating];
  
  // Calculate ring position (300-850 scale)
  const scorePercent = ((creditScore.score - 300) / 550) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference * 0.75; // 270 degrees

  return (
    <div className="space-y-6">
      {/* Score visualization */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Your Credit Score</p>
            <p className="text-xs text-muted-foreground">
              Updated {new Date(creditScore.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-1",
            creditScore.trend === 'up' ? 'text-success' :
            creditScore.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
          )}>
            {creditScore.trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : creditScore.trend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {creditScore.trend === 'up' ? '+' : creditScore.trend === 'down' ? '-' : ''}
              {creditScore.changeAmount} pts
            </span>
          </div>
        </div>
        
        {/* Circular gauge */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 200 200">
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              strokeLinecap="round"
            />
            {/* Score arc */}
            <motion.circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className={config.color}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Score display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p 
              className={cn("text-5xl font-bold font-display", config.color)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              {creditScore.score}
            </motion.p>
            <p className="text-sm font-medium capitalize">{creditScore.rating}</p>
          </div>
        </div>
        
        {/* Scale reference */}
        <div className="flex justify-between text-xs text-muted-foreground px-4">
          <span>300</span>
          <span>Poor</span>
          <span>Fair</span>
          <span>Good</span>
          <span>Excellent</span>
          <span>850</span>
        </div>
      </div>
      
      {/* Score factors */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold font-display mb-4">Score Factors</h3>
        <div className="space-y-4">
          {Object.entries(creditScore.factors).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {factorLabels[key as keyof typeof factorLabels]}
                </span>
                <span className={cn(
                  "text-sm font-semibold",
                  value >= 80 ? 'text-success' :
                  value >= 60 ? 'text-warning' : 'text-destructive'
                )}>
                  {value}%
                </span>
              </div>
              <Progress 
                value={value} 
                className={cn(
                  "h-2",
                  value >= 80 ? '[&>div]:bg-success' :
                  value >= 60 ? '[&>div]:bg-warning' : '[&>div]:bg-destructive'
                )}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Insight */}
      <div className="glass-card p-4 rounded-xl border-l-4 border-primary">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm mb-1">AI Insight</p>
            <p className="text-sm text-muted-foreground">
              Your credit score has improved by {creditScore.changeAmount} points. Keep making on-time payments 
              and consider reducing your credit utilization below 20% for an even higher score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
