import { useEffect } from "react";
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
    });
  }, []);
  return (
    <div className="App">
      <RouteMain />
      <ToastContainer />
    </div>
  );
}

export default App;
