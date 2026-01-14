import { User, HelpCircle, MapPin, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navLinks = [
    { label: "Hotels", href: "#" },
    { label: "Cars", href: "#" },
    { label: "Flights", href: "#" },
    { label: "Packages", href: "#" },
    { label: "Cruises", href: "#" },
    { label: "Experiences", href: "#" },
  ];

  return (
    <header className="bg-white border-b border-gray-100 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="text-[hsl(217,91%,50%)] font-bold text-2xl tracking-tight">
            priceline<span className="text-[hsl(217,91%,50%)]">®</span>
          </a>
          
          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-[hsl(217,91%,50%)] font-medium text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <Button variant="ghost" size="sm" className="rounded-full h-9 px-3 gap-2 text-gray-700 hover:bg-gray-100">
            <div className="w-7 h-7 rounded-full bg-[hsl(271,70%,50%)] flex items-center justify-center text-white text-xs font-semibold">
              P
            </div>
            <span className="hidden sm:inline text-sm font-medium">Penny</span>
          </Button>

          {/* US Flag */}
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-gray-100">
            <div className="w-6 h-6 rounded-full bg-gradient-to-b from-blue-600 via-white to-red-600 border border-gray-200" />
          </Button>

          {/* Help */}
          <Button variant="ghost" size="sm" className="rounded-full h-9 px-3 gap-1.5 text-gray-700 hover:bg-gray-100">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help</span>
          </Button>

          {/* Find My Trip */}
          <Button variant="ghost" size="sm" className="rounded-full h-9 px-3 gap-1.5 text-gray-700 hover:bg-gray-100">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Find My Trip</span>
          </Button>

          {/* VIP Join */}
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full h-9 px-4 gap-2 border-2 border-[hsl(45,90%,50%)] text-gray-800 hover:bg-[hsl(45,90%,95%)]"
          >
            <Crown className="w-4 h-4 text-[hsl(45,90%,40%)]" />
            <span className="text-sm font-medium">Sign In</span>
            <span className="text-xs text-[hsl(45,90%,40%)] font-semibold">JOIN VIP</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
