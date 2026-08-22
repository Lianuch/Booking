import type { FC } from "react";
import PricingCard from "../PricingCard/PricingCard";

const PricingCards: FC = () => {
  const plans = [
    {
      duration: "1 Month",
      description: "Free",
      price: 5,
    },
    {
      duration: "3 Months",
      description: "Free",
      price: 10,
    },
    {
      duration: "6 Months",
      description: "Free",
      price: 20,
    },
    {
      duration: "12 Months",
      description: "Free",
      price: 30,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {plans.map((plan) => (
        <PricingCard
          key={plan.duration}
          duration={plan.duration}
          description={plan.description}
          price={plan.price}
        />
      ))}
    </div>
  );
};

export default PricingCards;
