import { useEffect } from "react";
import {
  checkAuth,
  useIsAuth,
  useIsLoading,
  logoutUser,
 
} from "./stores/use-user.store";

import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import Layout from "./components/Layout/Layout";
import SettingPage from "./pages/Settings/SettingsPage";
import BookingPage from "./pages/Booking/BookingPage";
import IsAuthPage from "./pages/IsAuth/IsAuthPage";
import RegisterPage from "./pages/Register/RegisterPage";
import AdminPage from "./pages/Admin/AdminPage";
function App() {
  const isLoading = useIsLoading();
  const isAuth = useIsAuth();

 useEffect(() => {
  checkAuth();
}, []);

  if (isLoading) {
    return <div  className="min-h-screen flex justify-center items-center">
      <h1 className="text-3xl font-semibold">Loading...</h1>
    </div>;
  }

  return (
<Routes>
  {!isAuth ? (
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/is-auth" element={<IsAuthPage />} />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </>
  ) : (
    <>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/admin-panel" element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )}
</Routes>
  );
}

export default App;
