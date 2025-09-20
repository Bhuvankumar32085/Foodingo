import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserDashboard from "../components/UserDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import DeliveryBoyDashboard from "../components/DeliveryBoyDashboard";
import { useGetCurrentShop } from "../hooks/useGetShop";

const Home = () => {
  const navigate = useNavigate();
  const { isLogging, loggedUser } = useSelector((store) => store.user);
  useGetCurrentShop(isLogging, loggedUser?.role);

  useEffect(() => {
    if (!isLogging) {
      navigate("/login");
    }
  }, [isLogging, navigate]);

  return (
    <div className="w-screen min-h-screen pt-[100px] flex flex-col items-center bg-[#fff9f6]">
      {loggedUser?.role == "user" && <UserDashboard />}
      {loggedUser?.role == "owner" && <OwnerDashboard />}
      {loggedUser?.role == "deliveryBoy" && <DeliveryBoyDashboard />}
    </div>
  );
};

export default Home;
