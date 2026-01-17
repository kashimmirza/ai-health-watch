import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  Car,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Location {
  lat: number;
  lng: number;
  name: string;
}

interface CarTrackingMapProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  onClose?: () => void;
}

const CarTrackingMap = ({ pickupLocation = "", dropoffLocation = "", onClose }: CarTrackingMapProps) => {
  const [pickup, setPickup] = useState(pickupLocation);
  const [destination, setDestination] = useState(dropoffLocation);
  const [isTracking, setIsTracking] = useState(false);
  const [carPosition, setCarPosition] = useState(0); // 0-100 percentage along route
  const [isWrongDirection, setIsWrongDirection] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(45); // minutes
  const [distance, setDistance] = useState(32.5); // km
  const [estimatedCost, setEstimatedCost] = useState(0);
  
  // Cost per km for different vehicle types
  const costPerKm = 0.85;
  const baseFare = 5.00;

  // Simulate car movement
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      setCarPosition((prev) => {
        if (prev >= 100) {
          setIsTracking(false);
          return 100;
        }
        
        // Randomly simulate wrong direction (5% chance)
        if (Math.random() < 0.05 && prev > 10 && prev < 90) {
          setIsWrongDirection(true);
          setTimeout(() => setIsWrongDirection(false), 3000);
        }
        
        // Update ETA
        const remaining = 100 - prev;
        setEstimatedTime(Math.round((remaining / 100) * 45));
        
        return prev + 2;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking]);

  // Calculate cost when distance changes
  useEffect(() => {
    const cost = baseFare + (distance * costPerKm);
    setEstimatedCost(cost);
  }, [distance]);

  const handleStartTracking = () => {
    if (pickup && destination) {
      setIsTracking(true);
      setCarPosition(0);
      setEstimatedTime(45);
      // Simulate distance calculation
      setDistance(Math.round((Math.random() * 50 + 10) * 10) / 10);
    }
  };

  const handlePauseTracking = () => {
    setIsTracking(false);
  };

  const handleReset = () => {
    setIsTracking(false);
    setCarPosition(0);
    setEstimatedTime(45);
    setIsWrongDirection(false);
  };

  return (
    <div className="space-y-4">
      {/* Location Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Pick-up Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            <Input
              placeholder="Enter pickup address"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Destination</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
            <Input
              placeholder="Enter destination address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Map Visualization (Mockup) */}
      <div className="relative bg-gradient-to-br from-[hsl(200,30%,95%)] to-[hsl(200,40%,90%)] rounded-xl h-[300px] overflow-hidden border border-gray-200">
        {/* Grid lines for map effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Simulated roads */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main route path */}
          <path
            d="M 15 75 Q 30 60 45 55 T 75 35 T 85 25"
            fill="none"
            stroke="hsl(217, 91%, 50%)"
            strokeWidth="0.8"
            strokeDasharray={carPosition > 0 ? "none" : "2,2"}
            className="opacity-60"
          />
          {/* Traveled path */}
          <path
            d="M 15 75 Q 30 60 45 55 T 75 35 T 85 25"
            fill="none"
            stroke="hsl(217, 91%, 50%)"
            strokeWidth="1.2"
            strokeDasharray={`${carPosition}, 100`}
            className="opacity-100"
          />
        </svg>

        {/* Pickup marker */}
        <div className="absolute" style={{ left: '12%', top: '70%' }}>
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium bg-white px-2 py-0.5 rounded shadow whitespace-nowrap">
              Pickup
            </span>
          </div>
        </div>

        {/* Destination marker */}
        <div className="absolute" style={{ left: '82%', top: '18%' }}>
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium bg-white px-2 py-0.5 rounded shadow whitespace-nowrap">
              Destination
            </span>
          </div>
        </div>

        {/* Car position (moving along route) */}
        {carPosition > 0 && (
          <div 
            className="absolute transition-all duration-1000 ease-linear"
            style={{ 
              left: `${12 + (carPosition * 0.7)}%`, 
              top: `${70 - (carPosition * 0.52)}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-xl",
              isWrongDirection ? "bg-orange-500 animate-bounce" : "bg-[hsl(217,91%,50%)]"
            )}>
              <Car className="h-5 w-5 text-white" />
            </div>
          </div>
        )}

        {/* Wrong direction alert */}
        {isWrongDirection && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Wrong Direction!</span>
          </div>
        )}

        {/* Completed badge */}
        {carPosition >= 100 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-medium">Arrived at destination!</span>
          </div>
        )}

        {/* Map attribution mockup */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          Map data (mockup)
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[hsl(217,91%,50%)]" />
              <div>
                <p className="text-xs text-gray-500">ETA</p>
                <p className="text-lg font-bold">{estimatedTime} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-[hsl(217,91%,50%)]" />
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p className="text-lg font-bold">{distance} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Est. Cost</p>
                <p className="text-lg font-bold">${estimatedCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Progress</p>
                <p className="text-lg font-bold">{Math.round(carPosition)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Fare</span>
            <span>${baseFare.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Distance ({distance} km × ${costPerKm}/km)</span>
            <span>${(distance * costPerKm).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total Estimated Cost</span>
            <span className="text-[hsl(217,91%,50%)]">${estimatedCost.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="flex gap-3">
        {!isTracking ? (
          <Button 
            onClick={handleStartTracking}
            className="flex-1 bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)]"
            disabled={!pickup || !destination}
          >
            <Play className="h-4 w-4 mr-2" />
            {carPosition > 0 ? 'Resume Tracking' : 'Start Tracking'}
          </Button>
        ) : (
          <Button 
            onClick={handlePauseTracking}
            variant="outline"
            className="flex-1"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pause
          </Button>
        )}
        <Button 
          onClick={handleReset}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-[hsl(217,91%,97%)] rounded-lg p-3 text-sm text-gray-600">
        <p className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-[hsl(217,91%,50%)] mt-0.5 flex-shrink-0" />
          <span>
            This is a demo visualization. Connect Google Maps API for real-time tracking with actual routes, 
            live car positions, and accurate ETA calculations.
          </span>
        </p>
      </div>
    </div>
  );
};

export default CarTrackingMap;
