import { Outlet } from "react-router-dom";
import SidebarForm from "../Sidebar/SidebarForm";

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[#0b0b0b] dark:bg-[#ffe5d9] dark:text-black text-white  ">
      <SidebarForm />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
