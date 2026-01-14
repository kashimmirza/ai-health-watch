import { useState } from "react";
import { Search, Calendar, Users, DollarSign, Car, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";

const HotelSearchForm = () => {
  const [hotelType, setHotelType] = useState("single");
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(addDays(new Date(), 1));
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 });
  const [addCar, setAddCar] = useState(false);
  const [addFlight, setAddFlight] = useState(false);

  return (
    <div className="space-y-4">
      {/* Hotel Type Selection */}
      <RadioGroup
        value={hotelType}
        onValueChange={setHotelType}
        className="flex items-center gap-6"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="single" id="single" />
          <Label htmlFor="single" className="text-sm text-gray-700 cursor-pointer">
            Single Hotel
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="multi" id="multi" />
          <Label htmlFor="multi" className="text-sm text-gray-700 cursor-pointer">
            Multi Hotel
          </Label>
        </div>
      </RadioGroup>

      {/* Destination Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Where to?"
          className="pl-12 h-14 text-base border-gray-300 rounded-lg focus:border-[hsl(217,91%,50%)] focus:ring-[hsl(217,91%,50%)]"
        />
      </div>

      {/* Date and Guests Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-14 justify-start text-left font-normal border-gray-300 hover:border-gray-400 rounded-lg"
            >
              <Calendar className="mr-3 h-5 w-5 text-gray-500" />
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500">Check-in - Check-out</span>
                <span className="text-sm text-gray-800">
                  {format(checkIn, "MM/dd/yyyy")} – {format(checkOut, "MM/dd/yyyy")}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="range"
              selected={{ from: checkIn, to: checkOut }}
              onSelect={(range) => {
                if (range?.from) setCheckIn(range.from);
                if (range?.to) setCheckOut(range.to);
              }}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Guests Selector */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-14 justify-start text-left font-normal border-gray-300 hover:border-gray-400 rounded-lg"
            >
              <Users className="mr-3 h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-800">
                {guests.adults} Adults, {guests.rooms} Room
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="start">
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Adults</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(g => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                  >
                    -
                  </Button>
                  <span>{guests.adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(g => ({ ...g, adults: g.adults + 1 }))}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rooms</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(g => ({ ...g, rooms: Math.max(1, g.rooms - 1) }))}
                  >
                    -
                  </Button>
                  <span>{guests.rooms}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setGuests(g => ({ ...g, rooms: g.rooms + 1 }))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Bundle + Save and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Bundle + Save */}
        <div className="flex items-center gap-4 bg-[hsl(150,60%,95%)] rounded-lg px-4 py-3">
          <div className="flex items-center gap-2 text-[hsl(150,60%,35%)]">
            <div className="w-6 h-6 rounded-full bg-[hsl(150,60%,35%)] flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Bundle + Save</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="add-car"
                checked={addCar}
                onCheckedChange={(checked) => setAddCar(checked === true)}
              />
              <Label htmlFor="add-car" className="text-sm text-gray-700 cursor-pointer flex items-center gap-1">
                <Car className="w-4 h-4" />
                Add a car
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="add-flight"
                checked={addFlight}
                onCheckedChange={(checked) => setAddFlight(checked === true)}
              />
              <Label htmlFor="add-flight" className="text-sm text-gray-700 cursor-pointer flex items-center gap-1">
                <Plane className="w-4 h-4" />
                Add a flight
              </Label>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button
          className="h-14 px-8 bg-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,45%)] text-white font-semibold text-base rounded-lg flex-1 sm:flex-none"
        >
          Find Your Hotel
        </Button>
      </div>

      {/* Info Text */}
      <p className="text-center text-sm text-gray-500">
        Hotel prices now shown with fees included.
      </p>
    </div>
  );
};

export default HotelSearchForm;
