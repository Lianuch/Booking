import avatar from "../../assets/avatar-temp.png";
import { useUser } from "../../stores/use-user.store";

const UserCard = () => {
  const user = useUser();
  return (
    <div className="w-full bg-[#1d1d1d] dark:bg-[#ced4da] rounded-3xl p-6 md:p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ">
      <div className="flex items-center gap-5 lg:flex-row flex-col">
        <img src={avatar} className="w-20 h-20 rounded-xl object-cover" />
        <h2 className="text-3xl font-semibold">{user.name}</h2>
      </div>

      <div className="flex items-center gap-10 lg:flex-row flex-col">

        <div className="flex justify-between items-center gap-4">
        <div className="border-l border-neutral-700 h-14 hidden lg:block" />
          <p className="text-neutral-600 text-md">Баланс</p>

          <p className="text-3xl font-bold">0.00 EUR</p>
        </div>

        <button className="cursor-pointer bg-white text-black rounded-full px-8 py-4 font-semibold">
          Поповнити
        </button>
      </div>
    </div>
  );
};

export default UserCard;
