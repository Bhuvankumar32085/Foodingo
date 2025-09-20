import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuCircleCheckBig } from "react-icons/lu";

const OredrPlaced = () => {
  const { loggedUser, isLogging } = useSelector((store) => store.user);
  const navigate = useNavigate();
  //protect routing
  useEffect(() => {
    if (!isLogging || loggedUser?.role != "user") navigate("/");
  }, [loggedUser, isLogging, navigate]);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
      <LuCircleCheckBig className="text-green-500 text-6xl mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Olaced</h1>
      <p className="text-gray-600 max-w-md mb-6">
        Thank you for your purchase, your order is being prepared. you can track
        your order status in the "My Oredrs Section "
      </p>
      <button
        onClick={() => navigate("/my-oredrs")}
        className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition"
      >
        Back To My Order
      </button>
    </div>
  );
};

export default OredrPlaced;
