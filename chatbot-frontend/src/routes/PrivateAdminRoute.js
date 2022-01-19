import { Navigate } from "react-router-dom";

export default function PrivateAdminRoute({ isAuth, children, isAdmin }) {
  return isAuth ? (
    isAdmin ? (
      children
    ) : (
      <Navigate to="/profile" />
    )
  ) : (
    <Navigate to="/login" />
  );
}
