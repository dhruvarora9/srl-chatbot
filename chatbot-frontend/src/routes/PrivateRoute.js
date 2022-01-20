import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ isAuth, children, isLogin }) {
  const location = useLocation();
  console.log(location);
  if (isLogin && isLogin === true)
    return isAuth ? <Navigate to="/profile" /> : children;
  else
    return isAuth ? (
      children
    ) : (
      <Navigate to="/login" replace state={{ from: location }} />
    );
}
