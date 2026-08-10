import { useEffect, useState } from "react";
import {
  checkAuth,
  logoutUser,
  useIsAuth,
  useIsLoading,
  useUser,
  useUserStore,
} from "./stores/use-user.store";
import type { IUser } from "./models/response/IUser";
import { UserService } from "./services/user.service";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import Layout from "./components/Layout/Layout";
import SettingPage from "./pages/Settings/SettingsPage";
import BookingPage from "./pages/Booking/BookingPage";
import IsAuthPage from "./pages/IsAuth/IsAuthPage";
import RegisterPage from "./pages/Register/RegisterPage";
function App() {
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();
  const user = useUser();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      checkAuth();
    } else {
      useUserStore.setState({ isLoading: false });
    }
  }, []);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch (error) {
      console.log(`Failed to get users: ${error}`);
    }
  }

  // if (isLoading) {
  //   return <span>Loading...</span>;
  // }
  // if (!isAuth) {
  //   return (
  //     <div>
  //       <LoginForm />
  //     </div>
  //   );
  // }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/settings" element={<SettingPage />} />

      </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/is-auth" element={<IsAuthPage />} />
      {/* <Route path="/register" element={<LoginForm />} /> */}

      {/* <h1>User authorized: {user?.email}</h1>

      <button onClick={logoutUser}>Logout</button>

      <div>
        <button onClick={getUsers}>Get Users</button>
      </div>

      <div>
        {users.map((user) => (
          <div key={user.id}>{user.email}</div>
        ))}
      </div> */}
    </Routes>
  );
}

export default App;
