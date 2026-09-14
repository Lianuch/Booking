import type { FC } from "react";

interface AdminUpdatePlanProps {
    editDuration: string;
    editDescription: string;
    editPrice: number;

    setEditDuration: (duration: string) => void;
    setEditDescription: (description: string) => void;
    setEditPrice: (price: number) => void;

    onConfirm: () => void;
    onCancel: () => void;
}

const AdminUpdatePlan: FC<AdminUpdatePlanProps> = ({editDuration, setEditDuration, editDescription, setEditDescription, editPrice, setEditPrice, onConfirm, onCancel}) => {
  return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-3xl rounded-xl border border-gray-700 bg-[#1d1d1d] p-8">
            <h2 className="text-2xl font-semibold">Edit plan </h2>
            <div className="mt-8 flex gap-4">
              {/* Duration */}
              <input
                type="text"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                placeholder="Duration"
                className="rounded-xl border border-gray-600 bg-transparent px-2 py-3 outline-none"
              />
              {/* Description */}
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                className="rounded-xl border border-gray-600 bg-transparent px-2 py-3 outline-none"
              />
              {/* Price */}
              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(Number(e.target.value))}
                placeholder="Price"
                className="rounded-xl border border-gray-600 bg-transparent px-2 py-3 outline-none"
              />
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={onCancel}
                className="w-full rounded-xl border cursor-pointer border-gray-500 px-6 py-3"
              >
                Cancel
              </button>

               <button
                onClick={onConfirm}
                className="w-full rounded-xl border cursor-pointer border-red-500 px-6 py-3 text-red-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
  )
}

export default AdminUpdatePlan
