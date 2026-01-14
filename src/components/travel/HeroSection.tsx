import { useState } from "react";
import SearchTabs from "./SearchTabs";
import HotelSearchForm from "./HotelSearchForm";
import FlightSearchForm from "./FlightSearchForm";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("hotels");

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[hsl(217,91%,95%)]" />
      
      {/* Blue decorative circle */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-[hsl(217,91%,50%)] opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Search Form */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Save big on your next hotel
            </h1>

            {/* Search Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <SearchTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="mt-6">
                {activeTab === "hotels" && <HotelSearchForm />}
                {activeTab === "flights" && <FlightSearchForm />}
                {activeTab === "packages" && (
                  <div className="py-8 text-center text-gray-500">
                    Package search form coming soon...
                  </div>
                )}
                {activeTab === "cars" && (
                  <div className="py-8 text-center text-gray-500">
                    Car rental search form coming soon...
                  </div>
                )}
                {activeTab === "cruises" && (
                  <div className="py-8 text-center text-gray-500">
                    Cruise search form coming soon...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Hero Image */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Pink/Purple gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(217,91%,60%)] via-[hsl(300,50%,70%)] to-[hsl(340,60%,75%)] rounded-3xl transform rotate-2" />
              
              {/* Content overlay */}
              <div className="relative bg-gradient-to-br from-[hsl(200,80%,60%)] via-[hsl(280,50%,65%)] to-[hsl(330,60%,70%)] rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="text-white">
                  <p className="text-lg font-medium tracking-wide mb-2">GO TO YOUR</p>
                  <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                    HAPPY<br />PRICE
                  </h2>
                </div>
                
                {/* Decorative phone mockup */}
                <div className="mt-6 bg-white rounded-2xl p-2 shadow-2xl transform rotate-3">
                  <div className="bg-[hsl(150,60%,50%)] rounded-xl px-4 py-2 text-white text-sm font-semibold">
                    Up to 60% OFF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
