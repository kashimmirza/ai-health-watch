import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const CarSearchForm = () => {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [dropoffTime, setDropoffTime] = useState("10:00 AM");
  const [vehicleType, setVehicleType] = useState("");
  const [sameDropoff, setSameDropoff] = useState(true);

  const timeOptions = [
    "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM",
    "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
    "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM"
  ];

  const vehicleTypes = [
    { value: "economy", label: "Economy" },
    { value: "compact", label: "Compact" },
    { value: "midsize", label: "Midsize" },
    { value: "standard", label: "Standard" },
    { value: "fullsize", label: "Full-size" },
    { value: "suv", label: "SUV" },
    { value: "minivan", label: "Minivan" },
    { value: "luxury", label: "Luxury" },
    { value: "convertible", label: "Convertible" },
    { value: "pickup", label: "Pickup Truck" },
  ];

  return (
    <div className="space-y-4">
      {/* Same dropoff checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="sameDropoff" 
          checked={sameDropoff}
          onCheckedChange={(checked) => setSameDropoff(checked as boolean)}
        />
        <label
          htmlFor="sameDropoff"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Return car to same location
        </label>
      </div>

      {/* Pickup Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Pick-up location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="City, airport, or address"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Dropoff Location - only show if different */}
      {!sameDropoff && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Drop-off location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="City, airport, or address"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Pickup Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Pick-up date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {pickupDate ? format(pickupDate, "MMM d, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Pick-up time</label>
          <Select value={pickupTime} onValueChange={setPickupTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dropoff Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Drop-off date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dropoffDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dropoffDate ? format(dropoffDate, "MMM d, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dropoffDate}
                onSelect={setDropoffDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Drop-off time</label>
          <Select value={dropoffTime} onValueChange={setDropoffTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vehicle Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Vehicle type (optional)</label>
        <Select value={vehicleType} onValueChange={setVehicleType}>
          <SelectTrigger>
            <Car className="mr-2 h-4 w-4 text-gray-400" />
            <SelectValue placeholder="All vehicle types" />
          </SelectTrigger>
          <SelectContent>
            {vehicleTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <Button className="w-full bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)] text-white py-6 text-lg font-semibold">
        Find Your Car
      </Button>
    </div>
  );
};

export default CarSearchForm;
