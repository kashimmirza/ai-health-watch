import TopBanner from "@/components/travel/TopBanner";
import Header from "@/components/travel/Header";
import HeroSection from "@/components/travel/HeroSection";
import RecentActivity from "@/components/travel/RecentActivity";
import AIChatWidget from "@/components/travel/AIChatWidget";

const TravelLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <Header />
      <HeroSection />
      <RecentActivity />
      <AIChatWidget />
    </div>
  );
};

export default TravelLanding;
