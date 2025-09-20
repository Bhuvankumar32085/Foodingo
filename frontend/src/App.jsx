import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import FrogotPassword from "./pages/FrogotPassword";
import Home from "./pages/Home";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUser } from "./hooks/useGetCurrUser";
import Nav from "./components/Nav";
import { useGetCity } from "./hooks/useGetCity";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import CartPage from "./pages/CartPage";
import CheckOut from "./pages/CheckOut";
import OredrPlaced from "./pages/OredrPlaced";
import MyOrder from "./pages/MyOrder";
import { useUpdateLocation } from "./hooks/useUpdateLocation";
import TrackOrder from "./components/TrackOrder";
import { useEffect } from "react";
import { socket } from "../socket";
import { setSocketId } from "./redux/slices/socketSlice";

function App() {
  const dispatch = useDispatch();
  const { isLogging, loggedUser } = useSelector((store) => store.user);
  useGetCurrentUser(isLogging);
  useGetCity();
  useUpdateLocation(isLogging);

  useEffect(() => {
    if (!isLogging || !loggedUser?._id) {
      socket.disconnect();
      return;
    }
    socket.connect();
    const handleConnect = () => {
      dispatch(setSocketId(socket.id));
      socket.emit("identity", loggedUser._id);
    };
    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [isLogging, loggedUser?._id, dispatch]);

  return (
    <>
      {isLogging && <Nav />}
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/frogot-password" element={<FrogotPassword />} />
        <Route path="/create-edit-shop" element={<CreateEditShop />} />
        <Route path="/add-food" element={<AddItem />} />
        <Route path="/edit-item" element={<EditItem />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/check-out" element={<CheckOut />} />
        <Route path="/order-placedt" element={<OredrPlaced />} />
        <Route path="/my-oredrs" element={<MyOrder />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
      </Routes>
    </>
  );
}

export default App;
