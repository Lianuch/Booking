import { useState, type FC } from "react";
import Checkouts from "../Checkouts/Checkouts";
import Pricing from "../Pricing/Pricing";

const Booking: FC = () => {
  const [activeTab, setActiveTab] = useState<"pricing" | "checkouts">(
    "pricing",
  );
  return (
    <div
      className="
    dark:bg-white
    bg-linear-to-br
    from-[#121213]
    to-[#252627]
    rounded-4xl
    flex
    flex-col
    items-center
    gap-8
    overflow-hidden
    p-8
  "
    >
      <h1 className="text-3xl font-semibold mb-6">Pricing</h1>

      <div className="flex justify-center">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4 rounded-full bg-[#1d1d1d] p-1 text-white dark:bg-[#e9ecef] dark:text-black">
            <button
              onClick={() => setActiveTab("pricing")}
              className={`rounded-full px-8 py-3 ${
                activeTab === "pricing"
                  ? "bg-[#0b0b0b] text-white dark:bg-[#e9ecef] dark:text-black"
                  : "bg-transparent text-white dark:text-black"
              }`}
            >
              Pricing
            </button>

            <button
              onClick={() => setActiveTab("checkouts")}
              className={`rounded-full px-8 py-3 ${
                activeTab === "checkouts"
                  ? "bg-[#0b0b0b] text-white dark:bg-[#e9ecef] dark:text-black"
                  : "bg-transparent text-white dark:text-black"
              }`}
            >
              Checkouts
            </button>
          </div>

          {activeTab === "pricing" && <Pricing />}
          {activeTab === "checkouts" && <Checkouts />}
        </div>
      </div>
    </div>
  );
};

export default Booking;
