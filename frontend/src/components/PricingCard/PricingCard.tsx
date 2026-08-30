import {  type FC } from "react";
import { ArrowRight } from "lucide-react";

interface PricingCardProps {
  duration: string; 
  description: string;
  price: number;
}
const PricingCard: FC<PricingCardProps> = ({
  duration,
  description,
  price,
}: PricingCardProps) => {
  return (
    <div className="mt-10 min-h-70 w-full rounded-xl border border-gray-400 p-8 bg-[#1d1d1d]">
      <div className="flex h-full flex-col justify-between gap-4">
        <div>
          <p className="text-gray-400 text-md">{duration}</p>
          <h1 className="text-2xl my-1">€{price}</h1>

          <p className="text-sm ">{description}</p>
        </div>

        <button  className="flex gap-2 w-full border border-gray-400 rounded-xl px-8 py-4 cursor-pointer justify-center">
          Get <ArrowRight />
          
        </button>
      </div>
    </div>
  );
};

export default PricingCard;
