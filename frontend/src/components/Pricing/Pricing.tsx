import { type FC } from "react";
import PricingCards from "../PricingCards/PricingCards";

const Pricing: FC = () => {
  return (
      <div className="flex justify-center ">
    <div className="flex flex-col  items-center">
        <h1 className="text-3xl font-semibold mb-2 ">Our pluns</h1>
        <p className="text-sm text-gray-400">
          Both of plans include full app. Montly is for stay longer with us.
        </p>
        <PricingCards/>
      </div>
    </div>
  );
};

export default Pricing;
