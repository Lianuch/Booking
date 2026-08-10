import logo from "../../assets/booking_logo.png";
import { DoorOpen, Settings, House, Menu } from "lucide-react";
import ThemeButton from "../ThemeButton/ThemeButton";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, type FC } from "react";

const SidebarForm: FC = () => {
  const navigate = useNavigate();
  const menuItems = [
    {
      name: "Home",
      icon: House,
      path: "/",
    },
    {
      name: "Bookings",
      icon: House,
      path: "/bookings",
    },

    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleToggle = () => {
    setCollapsed(!collapsed);
    setIsOpen(!isOpen);
  };
  return (
    <aside
      className={`
        relative
        min-h-screen
          bg-[#151515]
    dark:bg-[#FFFACD]
    dark:border-r
    dark:border-[#D8BFD8]
    
        text-xl
        font-semibold
        flex
        flex-col
        p-4
        rounded-r-3xl

        ${collapsed ? "w-20" : "w-70"}
      `}
    >
      <div className="flex justify-center mb-6">
        {collapsed ? (
          <img onClick={()=> navigate("/")}
            src={logo}
            alt="Logo"
            className="w-10 h-10 object-cover object-left cursor-pointer"
          />
        ) : (
          <img src={logo} onClick={()=> navigate("/")} alt="Logo" className="w-64 cursor-pointer" />
        )}
      </div>

      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-neutral-800"
            >
              <Icon size={24} className="shrink-0" />

              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {!collapsed && <ThemeButton />}

        <button className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-neutral-800">
          <DoorOpen size={24} />

          {!collapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={handleToggle}
          className="absolute top-1/2 -right-4 cursor-pointer flex items-center justify-center p-3 rounded-2xl hover:bg-neutral"
        >
          <Menu />
        </button>
      </div>
    </aside>
  );
};

export default SidebarForm;
