import { useSelector } from "react-redux";
import { Route, Routes } from "react-router";
import AdminHome from "../components/AdminHome/AdminHome";
import Home from "../components/Home/Home";
import LiveChatCS from "../components/LiveChatCS/LiveChatCS";
import LiveChatUser from "../components/LiveChatUser/LiveChatUser";
import SearchPage from "../components/SearchPage/SearchPage";
import SearchDetails from "../components/SearchPage/SearchDetails";

import Login from "../components/login-admin-styles/login/Login";
import Profile from "../components/Profile/Profile";
import UserLiveChatForm from "../components/UserLiveChatForm/UserLiveChatForm";
import PrivateAdminRoute from "./PrivateAdminRoute";
import PrivateRoute from "./PrivateRoute";

const RouteMain = () => {
  const isAuthenticated = useSelector((store) => store.auth.token !== null);
  const isAdmin = useSelector(
    (store) => store.auth.isAdmin && store.auth.isAdmin === true
  );
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
        path="/profile"
        element={
          <PrivateRoute isAuth={isAuthenticated}>
            <Profile />
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
      <Route
        path="/dashboard"
        element={
          <PrivateAdminRoute isAdmin={isAdmin} isAuth={isAuthenticated}>
            <AdminHome />
          </PrivateAdminRoute>
        }
      />
      <Route path="/livechatform" element={<UserLiveChatForm />} />
      <Route path="/livechatuser/:roomId" element={<LiveChatUser />} />
      <Route path="/searchpage" element={<SearchPage />} />
      <Route path="/searchdetails" element={<SearchDetails />} />
    </Routes>
  );
};

export default RouteMain;
