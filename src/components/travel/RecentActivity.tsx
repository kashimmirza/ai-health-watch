import { Car, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  type: "car" | "hotel";
  title: string;
  dates: string;
}

const RecentActivity = () => {
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "car",
      title: "Billings Logan Intl Airport (BIL)",
      dates: "Sun, Jan 11 - Tue, Jan 13",
    },
    {
      id: "2",
      type: "car",
      title: "Charlotte Douglas Intl Airport (C...",
      dates: "Fri, Jan 16 - Thu, Feb 19",
    },
    {
      id: "3",
      type: "hotel",
      title: "Las Vegas, NV",
      dates: "Tue, Feb 17 - Fri, Feb 20",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "car":
        return <Car className="w-5 h-5 text-[hsl(217,91%,50%)]" />;
      case "hotel":
        return <Building2 className="w-5 h-5 text-[hsl(217,91%,50%)]" />;
      default:
        return null;
    }
  };

  return (
    <section className="bg-white py-8 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Pick up where you left off</h2>
          <Button 
            variant="outline" 
            className="text-[hsl(217,91%,50%)] border-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,95%)] rounded-full"
          >
            View All Recent Activity
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[hsl(217,91%,95%)] flex items-center justify-center">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 capitalize mb-0.5">{activity.type}s</p>
                <p className="font-semibold text-gray-900 truncate">{activity.title}</p>
                <p className="text-sm text-[hsl(217,91%,50%)]">{activity.dates}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentActivity;
