import { type FC} from "react";

interface AdminUpdatePlanProps {
    addDuration: string;
    addDescription: string;
    addPrice: number;

    setAddDuration: (duration: string) => void;
    setAddDescription: (description: string) => void;
    setAddPrice: (price: number) => void;

    onConfirm: () => void;
    onCancel: () => void;
}

const AdminCreatePlan: FC<AdminUpdatePlanProps> = ({addDuration, setAddDuration, addDescription, setAddDescription, addPrice, setAddPrice, onConfirm, onCancel}) => {
  
  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-3xl rounded-xl border border-gray-700 dark:bg-white dark:text-black bg-[#1d1d1d] p-8">
            <div className="mt-8 flex gap-4">
              {/* Duration */}
              <input
                type="text"
                value={addDuration}
                onChange={(e) => setAddDuration(e.target.value)}
                placeholder="Duration"
                className="rounded-xl border border-gray-600 bg-transparent px-2 py-3 outline-none"
              />
              {/* Description */}
              <input
                type="text"
                value={addDescription}
                onChange={(e) => setAddDescription(e.target.value)}
                placeholder="Description"
                className="rounded-xl border border-gray-600 bg-transparent px-2 py-3 outline-none"
              />
              {/* Price */}
              <input
                type="number"
                value={addPrice}
                onChange={(e) => setAddPrice(Number(e.target.value))}
                placeholder="Price"
                className="rounded-xl border border-gray-600 bg-transparent px-2 py-3 outline-none"
              />
            </div>
              <div className="mt-8 flex gap-4">
              <button
                onClick={onCancel}
                className="w-full transition-transform duration-200 hover:scale-105 rounded-xl border cursor-pointer border-gray-500 px-6 py-3"
              >
                Cancel
              </button>

               <button
                onClick={onConfirm}
                className="w-full transition-transform duration-200 hover:scale-105 rounded-xl border cursor-pointer border-red-500 px-6 py-3 text-red-500"
              >
                Add plan
              </button>
            </div>
          </div>
        </div>
  )
}

export default AdminCreatePlan
