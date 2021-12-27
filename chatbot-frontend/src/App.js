import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { checkLoginStatus, setLoginStatus } from "./actions/authAction";
import "./App.css";
import RouteMain from "./routes/Routes";
import "react-toastify/dist/ReactToastify.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/app";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   dispatch(checkLoginStatus());
  // });
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setLoginStatus(user.email, user.accessToken, "Admin"));
      } else {
        dispatch(setLoginStatus(null, null, null));
      }
      setLoading(false);
    });
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
