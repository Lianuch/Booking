import { useState, type FC } from "react";
import { registerUser } from "../../stores/use-user.store";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/booking_logo.png";
import ThemeButton from "../ThemeButton/ThemeButton";
const RegisterForm: FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isFormValid = email.trim() !== "" && password.trim() !== "";
  return (
    <div className="bg-white  dark:bg-[#111111] text-black dark:text-white shadow-2xl w-170 min-h-212.5 rounded-[50px] p-10 flex flex-col items-center ">
      <img src={logo} alt="Logo" className="w-44 mt-10 mb-10" />
      <div className="w-full max-w-130">
         <div>
            <label className="text-gray-400 text-sm ml-5" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="bg-transparent w-full border border-neutral-700 rounded-xl px-6 py-2 mb-2 "
              placeholder="Enter your name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              value={name}
            />
        </div>
        <label className="text-gray-400 text-sm ml-5" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="bg-transparent w-full border border-neutral-700 rounded-xl px-6 py-2 mb-2 "
          placeholder="Enter your address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          value={email}
        />
        <div className="relative">
          <label className="text-gray-400 text-sm ml-5" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="bg-transparent w-full border border-neutral-700 rounded-xl px-6 py-2 mb-2 pr-12 "
            placeholder="Enter your password"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            value={password}
          />
          <button
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/3 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
          </button>
        </div>
       

        <button
          disabled={!isFormValid}
          onClick={() => {
            registerUser(name, email, password);
          }}
          className=" w-full
    h-16
    mt-4
    rounded-2xl
    bg-neutral-900
    text-blue-500
    font-semibold
    transition-all
    enabled:hover:bg-neutral-900
    enabled:cursor-pointer
    disabled:opacity-50
    disabled:cursor-not-allowed"
        >
          Sing up
        </button>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-neutral-700"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-neutral-700"></div>
        </div>

        <button className="w-full h-16  rounded-2xl cursor-pointer dark:bg-white bg-black  text-white dark:text-black font-semibold flex items-center justify-center gap-3">
          <FcGoogle size={24} /> Sign in with Google
        </button>

        <div className="mt-8">
          <ThemeButton />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
