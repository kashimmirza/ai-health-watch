import { X } from "lucide-react";

const TopBanner = () => {
  return (
    <div className="bg-[hsl(217,91%,40%)] text-white py-2 px-4 text-center text-sm flex items-center justify-center gap-2">
      <span className="font-semibold">The Resolution to Travel Sale:</span>
      <span>Start 2026 with more savings! Take an extra 10% off Hotel Express Deals®. Use code: <strong>RESET2026</strong></span>
      <a href="#" className="text-[hsl(180,70%,60%)] hover:underline font-medium ml-1">
        Learn More
      </a>
    </div>
  );
};

export default TopBanner;
