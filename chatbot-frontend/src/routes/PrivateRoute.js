import { Navigate } from "react-router-dom";

export default function PrivateRoute({ isAuth, children, isLogin }) {
  if (isLogin && isLogin === true)
    return isAuth ? <Navigate to="/profile" /> : children;
  else return isAuth ? children : <Navigate to="/login" />;
}
