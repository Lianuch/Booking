import { useEffect, type FC } from "react";
import PricingCard from "../PricingCard/PricingCard";
import { usePlans, getPlans } from "../../stores/use-plan.store";

const PricingCards: FC = () => {
  const plans = usePlans();
  useEffect(() => {
    getPlans();
  })
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
