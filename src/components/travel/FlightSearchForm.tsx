import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Plane, Users, ArrowRightLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const FlightSearchForm = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState("1");
  const [tripType, setTripType] = useState("roundtrip");

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    console.log("Flight search:", { origin, destination, departDate, returnDate, passengers, tripType });
  };

  return (
    <div className="space-y-4">
      {/* Trip Type Selection */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundtrip"
            checked={tripType === "roundtrip"}
            onChange={(e) => setTripType(e.target.value)}
            className="w-4 h-4 text-[hsl(217,91%,50%)]"
          />
          <span className="text-sm text-gray-700">Round-trip</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneway"
            checked={tripType === "oneway"}
            onChange={(e) => setTripType(e.target.value)}
            className="w-4 h-4 text-[hsl(217,91%,50%)]"
          />
          <span className="text-sm text-gray-700">One-way</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="multicity"
            checked={tripType === "multicity"}
            onChange={(e) => setTripType(e.target.value)}
            className="w-4 h-4 text-[hsl(217,91%,50%)]"
          />
          <span className="text-sm text-gray-700">Multi-city</span>
        </label>
      </div>

      {/* Origin and Destination */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">From</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="City or airport"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-[hsl(217,91%,50%)] focus:ring-[hsl(217,91%,50%)]"
            />
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={swapLocations}
          className="absolute left-1/2 top-[38px] -translate-x-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 transition-colors hidden md:flex"
        >
          <ArrowRightLeft className="w-4 h-4 text-gray-600" />
        </button>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">To</Label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="City or airport"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-[hsl(217,91%,50%)] focus:ring-[hsl(217,91%,50%)]"
            />
          </div>
        </div>
      </div>

      {/* Dates and Passengers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Departure Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Depart</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-12 justify-start text-left font-normal border-gray-300",
                  !departDate && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                {departDate ? format(departDate, "EEE, MMM d") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departDate}
                onSelect={setDepartDate}
                initialFocus
                className="pointer-events-auto"
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        {tripType === "roundtrip" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Return</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal border-gray-300",
                    !returnDate && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
                  {returnDate ? format(returnDate, "EEE, MMM d") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < (departDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Passengers */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Travelers</Label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="h-12 border-gray-300">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <SelectValue placeholder="1 Adult" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Adult</SelectItem>
              <SelectItem value="2">2 Adults</SelectItem>
              <SelectItem value="3">3 Adults</SelectItem>
              <SelectItem value="4">4 Adults</SelectItem>
              <SelectItem value="5">5 Adults</SelectItem>
              <SelectItem value="6">6+ Adults</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={handleSearch}
        className="w-full h-12 bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)] text-white font-semibold text-lg rounded-lg shadow-md"
      >
        Find Your Flight
      </Button>

      {/* Flexible Dates Link */}
      <div className="text-center">
        <button className="text-[hsl(217,91%,50%)] text-sm font-medium hover:underline">
          My dates are flexible
        </button>
      </div>
    </div>
  );
};

export default FlightSearchForm;
