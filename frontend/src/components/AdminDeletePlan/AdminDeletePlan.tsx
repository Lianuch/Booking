import type { FC } from "react";

interface AdminDeletePlanProps {
    duration: string;
    onCancel: () => void;
    onConfirm: () => void;
}


const AdminDeletePlan: FC<AdminDeletePlanProps> = ({duration, onCancel, onConfirm}) => {

  return (
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-xl border border-gray-700 bg-[#1d1d1d] p-8">
            <h2 className="text-2xl font-semibold">Delete plan?</h2>

            <p className="mt-3 text-gray-400">
              Are you sure you want to delete the{" "}
              <span className="font-semibold text-white">{duration}</span> plan?
              This action cannot be undone.
            </p>

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
                Delete
              </button>
            </div>
          </div>
        </div>
  )
}

export default AdminDeletePlan
   