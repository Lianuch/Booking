import type { FC } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
const LoginPage: FC = () => {
  return (
    <div
      className="
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
      <LoginForm />
    </div>
  );
};

export default LoginPage;
