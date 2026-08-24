import { Mail } from "lucide-react";
import avatar from "../../assets/avatar-temp.png";
import { FcGoogle } from "react-icons/fc";
import { useUser } from "../../stores/use-user.store";
import { Check } from 'lucide-react';

const SettingsPage = () => {
const user = useUser();
  return (
    <div className="max-w-4xl mx-auto px-12 py-10">
      <div className="w-full  px-12 py-10">
        <h1 className="text-3xl font-semibold mb-10">Settings</h1>

        <div className="flex items-center gap-6">
          <img
            src={avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-xl object-cover"
          />

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold">{user.name}</h2>

          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-700 mt-8 mb-4" />

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold">Types of authorization</h2>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                <Mail size={24} />
              </div>

              <p className="text-xl">Email</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-6 flex justify-center">
                <FcGoogle size={24} />
              </div>

              <p className="text-xl">Sign in with Google</p>
            </div>
            <div className="w-full h-px bg-neutral-700 mt-4 mb-4" />

            <button className="dark:text-black text-white w-1/3 cursor-pointer border border-red-500 py-2 px-4 text-lg rounded-full">
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
