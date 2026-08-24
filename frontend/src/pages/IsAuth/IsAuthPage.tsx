import { CircleChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

const IsAuthPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        min-h-screen
        flex items-center justify-center
        bg-linear-to-br
        from-slate-400
        via-mauve-300
        to-indigo-300
        dark:from-red-400
        dark:via-purple-500
        dark:to-indigo-700
      "
    >
      <div
        className="
          relative
          bg-white dark:bg-[#111111]
          text-black dark:text-white
          shadow-2xl
          w-130
          min-h-90
          rounded-[50px]
          p-10
          flex flex-col
          items-center
        "
      >
        {/* Back button */}
        <div
          onClick={() => navigate("/login")}
          className="
            absolute
            top-5
            left-5
            text-gray-400
            hover:text-gray-700
            dark:hover:text-white
            cursor-pointer
          "
        >
          <CircleChevronLeft size={30} />
        </div>

        {/* Content */}
        <div className="mt-2 text-3xl font-bold mb-4">
          You are not authorized
        </div>

        <div className="text-gray-400 text-center mb-8">
          Please log in to access this page. If you don't have an account,
          please register first.
        </div>

        {/* Buttons */}
        <div className="w-full flex  gap-4">
          <button
            onClick={() => navigate("/register")}
            className="
              cursor-pointer
              bg-white 
              text-black
              hover:bg-blue-600
              font-bold
              h-14
              w-full
              rounded-2xl
            "
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default IsAuthPage;
