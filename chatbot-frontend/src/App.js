import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { logoutAdmin, setLoginStatus } from "./actions/authAction";
import "./App.css";
import RouteMain from "./routes/Routes";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/app";
import { ADMIN_LOADING } from "./action-types/actionTypes";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   dispatch(checkLoginStatus());
  // });
  useEffect(() => {
    dispatch({
      type: ADMIN_LOADING,
    });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdTokenResult(true).then((res) => {
          dispatch(
            setLoginStatus(
              user.email,
              user.accessToken,
              res.claims.admin ? true : false
            )
          );
          setLoading(false);
          console.log(res.claims.admin);
        });
      } else {
        dispatch(logoutAdmin());
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);
  return (
    <div className="App">
      {!loading && (
        <div>
          <RouteMain />
          <ToastContainer />
        </div>
      )}
      {loading && <p>Loading....</p>}
    </div>
  );
}

export default App;
