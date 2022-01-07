import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";
import AdminHome from "../components/AdminHome/AdminHome";
import Home from "../components/Home/Home";
import LiveChatCS from "../components/LiveChatCS/LiveChatCS";
import LiveChatUser from "../components/LiveChatUser/LiveChatUser";

import Login from "../components/login-admin-styles/login/Login";
import UserLiveChatForm from "../components/UserLiveChatForm/UserLiveChatForm";
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
      <Route
        path="/livechatcs/:roomId"
        element={
          <PrivateRoute isAuth={isAuthenticated}>
            <LiveChatCS />
          </PrivateRoute>
        }
      />
      <Route path="/livechatform" element={<UserLiveChatForm />} />
      <Route path="/livechatuser/:roomId" element={<LiveChatUser />} />
    </Routes>
  );
};

export default RouteMain;
