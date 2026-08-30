import { type FC, useState } from "react";
import { deletePlan, updatePlan } from "../../stores/use-plan.store";
import AdminDeletePlan from "../AdminDeletePlan/AdminDeletePlan";
import AdminUpdatePlan from "../AdminUpdatePlan/AdminUpdatePlan";

interface PricingCardProps {
  id: string;
  duration: string;
  description: string;
  price: number;
}

const AdminPlanCard: FC<PricingCardProps> = ({
  id,
  duration,
  description,
  price,
}: PricingCardProps) => {
  const [modal, setModal] = useState<"edit" | "delete" | null>(null);
  const [editDuration, setEditDuration] = useState<string>(duration);
  const [editDescription, setEditDescription] = useState<string>(description);
  const [editPrice, setEditPrice] = useState<number>(price);

  const handleDelete = async () => {
    await deletePlan(id);
    setModal(null);
  };
  const handleEdit = async () => {
    const updatedPlan = await updatePlan(
      id,
      editDuration,
      editPrice,
      editDescription,
    );
    if (updatedPlan) {
      setModal(null);
    }
  };

  return (
    <>
      <div className="mt-10 min-h-70 w-full rounded-xl border border-gray-400 bg-[#1d1d1d] p-8">
        <div className="flex h-full flex-col justify-between gap-4">
          <div>
            <p className="text-md text-gray-400">{duration}</p>

            <h1 className="my-1 text-2xl">€{price}</h1>

            <p className="text-sm">{description}</p>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => setModal("edit")}
              className="flex w-full cursor-pointer justify-center rounded-xl border border-blue-500 px-8 py-4"
            >
              Edit
            </button>

            <button
              onClick={() => setModal("delete")}
              className="flex w-full cursor-pointer justify-center rounded-xl border border-red-500 px-8 py-4"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {modal === "delete" && (
        <AdminDeletePlan
          duration={duration}
          onCancel={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}
      {modal === "edit" && (
        <AdminUpdatePlan
          editDuration={editDuration}
          editDescription={editDescription}
          editPrice={editPrice}
          setEditDuration={setEditDuration}
          setEditDescription={setEditDescription}
          setEditPrice={setEditPrice}
          onConfirm={handleEdit}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
};

export default AdminPlanCard;
