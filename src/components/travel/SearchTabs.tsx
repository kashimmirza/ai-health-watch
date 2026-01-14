import { Building2, Plane, Package, Car, Ship } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs = ({ activeTab, onTabChange }: SearchTabsProps) => {
  const tabs = [
    { id: "hotels", label: "Hotels", icon: Building2 },
    { id: "flights", label: "Flights", icon: Plane },
    { id: "packages", label: "Packages", icon: Package },
    { id: "cars", label: "Cars", icon: Car },
    { id: "cruises", label: "Cruises", icon: Ship },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 pb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
              isActive
                ? "bg-[hsl(217,91%,50%)] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SearchTabs;
