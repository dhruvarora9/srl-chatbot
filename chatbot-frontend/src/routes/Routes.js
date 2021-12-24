import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";
import AdminHome from "../components/AdminHome/AdminHome";
import Home from "../components/Home/Home";

import Login from "../components/login-admin-styles/login/Login";
import PrivateRoute from "./PrivateRoute";

const RouteMain = () => {
  const isAuthenticated = useSelector((store) => store.auth.token !== null);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PrivateRoute isAuth={isAuthenticated} isLogin={true}>
            <Login />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute isAuth={isAuthenticated}>
            <AdminHome />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RouteMain;
