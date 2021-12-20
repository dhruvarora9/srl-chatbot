import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { checkLoginStatus } from "./actions/authAction";
import "./App.css";
import RouteMain from "./routes/Routes";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkLoginStatus());
  });
  return (
    <div className="App">
      <RouteMain />
      <ToastContainer />
    </div>
  );
}

export default App;
