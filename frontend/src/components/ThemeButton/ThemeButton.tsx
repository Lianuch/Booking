import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/useTheme";


const ThemeButton = () => {
  const {dark, toggleTheme} = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="w-full h-16 hover:bg-neutral-800 rounded-2xl cursor-pointer border border-neutral-700 text-blue-500 font-semibold flex items-center justify-center gap-3"
    >
      {/* Dark Mode Light Mode */}
      {dark ? "Light Mode" : "Dark Mode"}
      {dark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeButton;
