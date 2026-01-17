import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Plane, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const PackageSearchForm = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [rooms, setRooms] = useState("1");
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [addCar, setAddCar] = useState(false);
  const [directFlights, setDirectFlights] = useState(false);

  return (
    <div className="space-y-4">
      {/* Origin */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Flying from</label>
        <div className="relative">
          <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="City or airport"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Flying to & staying at</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="City, hotel, or destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Check-in / Check-out dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-in</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, "MMM d, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Check-out</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? format(checkOutDate, "MMM d, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Travelers */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Travelers</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <span className="text-xs text-gray-500">Rooms</span>
            <Select value={rooms} onValueChange={setRooms}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-500">Adults</span>
            <Select value={adults} onValueChange={setAdults}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-500">Children</span>
            <Select value={children} onValueChange={setChildren}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bundle Options */}
      <div className="bg-[hsl(217,91%,97%)] rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-gray-700">Bundle & Save</p>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="addCar" 
            checked={addCar}
            onCheckedChange={(checked) => setAddCar(checked as boolean)}
          />
          <label
            htmlFor="addCar"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Add a car rental and save up to 25%
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="directFlights" 
            checked={directFlights}
            onCheckedChange={(checked) => setDirectFlights(checked as boolean)}
          />
          <label
            htmlFor="directFlights"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Direct flights only
          </label>
        </div>
      </div>

      {/* Savings Banner */}
      <div className="bg-[hsl(150,60%,95%)] border border-[hsl(150,60%,50%)] rounded-lg p-3 flex items-center gap-2">
        <div className="bg-[hsl(150,60%,50%)] text-white text-xs font-bold px-2 py-1 rounded">
          SAVE
        </div>
        <p className="text-sm text-gray-700">
          Book flight + hotel together and <span className="font-semibold">save up to $625</span>
        </p>
      </div>

      {/* Search Button */}
      <Button className="w-full bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)] text-white py-6 text-lg font-semibold">
        Search Packages
      </Button>
    </div>
  );
};

export default PackageSearchForm;
