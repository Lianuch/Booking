interface DeleteAccountProps {
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteAccount = ({ onCancel, onConfirm }: DeleteAccountProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-[#1d1d1d] p-8">
        <h2 className="text-2xl font-semibold">Delete account?</h2>

        <p className="mt-3 text-gray-400">
          Are you sure you want to <span className="font-semibold text-lg text-red-400">delete your account? </span> This action cannot be
          undone.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={onCancel}
            className="w-full cursor-pointer rounded-xl border border-gray-500 px-6 py-3 transition-transform duration-200 hover:scale-105"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full cursor-pointer rounded-xl border border-red-500 px-6 py-3 text-red-500 transition-transform duration-200 hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
