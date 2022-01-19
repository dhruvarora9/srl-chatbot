import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logoutAdmin } from "../../actions/authAction";

function Profile() {
  const authToken = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const profileEmail = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();
  return (
    <div className="bg-zinc-100 w-full min-h-screen">
      <div className="w-full py-2 px-1 bg-teal-700 flex justify-between">
        <span className="text-white font-medium text-lg py-1 px-2">
          Profile
        </span>
        <div className="px-2">
          {isAdmin && (
            <Link
              to="/dashboard"
              type="button"
              className="px-2 py-1 bg-white hover:cursor-pointer rounded-sm mx-1 hover:no-underline"
            >
              Dashboard
            </Link>
          )}
          <Link
            to="/"
            type="button"
            className="px-2 py-1 bg-white hover:cursor-pointer rounded-sm mx-1 hover:no-underline"
          >
            Home
          </Link>
          <button
            onClick={() => dispatch(logoutAdmin())}
            className="px-2 py-1 bg-white hover:cursor-pointer rounded-sm mx-1 hover:text-blue-600"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col px-2 pt-4">
          <span className="font-semibold text-left text-lg">
            Welcome {profileEmail}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
