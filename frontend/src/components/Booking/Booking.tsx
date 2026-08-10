const Booking = () => {
  return (
<div  className="
    dark:bg-white
    bg-linear-to-br
    from-[#212529]
    to-[#343a40]
    rounded-4xl
    flex
    flex-col
    items-center
    gap-8
    overflow-hidden
    p-8
  ">
          <h1 className="text-3xl font-semibold mb-6">Bookings</h1>

         <div className="flex justify-center">
          <div className="flex gap-4 rounded-full bg-[#1d1d1d] p-1 text-white dark:bg-[#e9ecef] dark:text-black">
            <button className="rounded-full bg-[#0b0b0b] px-8 py-3 text-white dark:bg-[#e9ecef] dark:text-black">
              Your bookings
            </button>

            <button className="rounded-full bg-transparent px-8 py-3 text-white dark:text-black">
              Your checkouts
            </button>
          </div>
        </div>

    </div>
  );
};

export default Booking;
