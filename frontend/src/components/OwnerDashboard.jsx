import React from "react";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashboard = () => {
  const { shop } = useSelector((store) => store.user);
  const { items } = useSelector((store) => store.item);
  const navigate = useNavigate();
  

  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  return (
    <>
      {shop == undefined && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:h-20 mb-4" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add your Restaurant
              </h1>
              <p className="mb-4 text-gray-600 text-sm sm:text-base">
                join our food delivery platform and rech thousands of hungry
                customer every day.
              </p>
              <button
                onClick={() => navigate("/create-edit-shop")}
                className="bg-[#ff4d2d] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transform-colors duration-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      {shop && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
            <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
            Welcome to {capitalizeWords(shop?.name)}
          </h1>
          <div className=" bg-white shadow-lg rounded-xl overflow-hidden border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative -z-0">
            <img
              src={shop?.image}
              alt={shop?.name}
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {capitalizeWords(shop?.name)}
              </h1>
              <p className="text-gray-500">
                {capitalizeWords(shop?.city)},{capitalizeWords(shop?.state)}
              </p>
              <p className="text-gray-500">{capitalizeWords(shop?.address)}</p>
            </div>
            <CiEdit
              onClick={() => navigate("/create-edit-shop")}
              size={30}
              className=" absolute top-[5px] right-[5px] bg-[#ff4d2d] text-white rounded-2xl p-1 cursor-pointer"
            />
          </div>
          {shop?.items.length == 0 && (
            <div className="flex justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col items-center text-center">
                  <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:h-20 mb-4" />
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add your Food Item
                  </h1>
                  <p className="mb-4 text-gray-600 text-sm sm:text-base">
                    Share Your Delicious with our customers by adding them to
                    tha menu.
                  </p>
                  <button
                    onClick={() => navigate("/add-food")}
                    className="bg-[#ff4d2d] text-white px-5 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transform-colors duration-200"
                  >
                    Add Food Item
                  </button>
                </div>
              </div>
            </div>
          )}


          {shop?.items.length > 0 && (
            <>
            <h1 className="text-xl sm:font-bold font-semibold">{capitalizeWords(shop?.name)} Menu</h1>
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {items.map((item, idx) => (
                <OwnerItemCard data={item} key={idx} />
              ))}
            </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default OwnerDashboard;
