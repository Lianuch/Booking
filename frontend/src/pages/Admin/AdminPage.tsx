import { useState } from "react";
import { usePlans } from "../../stores/use-plan.store";
import AdminPlanCard from "../../components/AdminPlanCard/AdminPlanCard";
import { createPlan } from "../../stores/use-plan.store";
import AdminCreatePlan from "../../components/AdminCreatePlan/AdminCreatePlan";
const AdminPage = () => {
  const plans = usePlans();
  const [showPlans, setShowPlans] = useState<boolean>(true);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [addDuration, setAddDuration] = useState<string>();
  const [addDescription, setAddDescription] = useState<string>();
  const [addPrice, setAddPrice] = useState<number>(0);

  const handleCreatePlan = async () => {
    await createPlan(addDuration, addPrice, addDescription);
    setAddModal(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-12 py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-semibold">Admin Panel</h1>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={() => setShowPlans((prev) => !prev)}
            className="text-3xl border border-gray-400 rounded-xl hover:bg-[#1d1d1d]  px-8 py-4 cursor-pointer"
          >
            {showPlans ? "Hide plans" : "Show plans"}
          </button>
          <button
            onClick={() => setAddModal((prev) => !prev)}
            className="text-3xl border border-gray-400 rounded-xl hover:bg-[#1d1d1d]  px-8 py-4 cursor-pointer"
          >
            Add plan
          </button>
        </div>
      </div>

      {showPlans && (
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <AdminPlanCard
                key={plan.id}
                id={plan.id}
                duration={plan.duration}
                description={plan.description}
                price={plan.price}
              />
            ))}
          </div>
        </div>
      )}

      {addModal && (
        <AdminCreatePlan
          addDuration={addDuration}
          setAddDuration={setAddDuration}
          addDescription={addDescription}
          setAddDescription={setAddDescription}
          addPrice={addPrice}
          setAddPrice={setAddPrice}
          onConfirm={handleCreatePlan}
          onCancel={() => setAddModal(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
