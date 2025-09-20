import React, { useEffect } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";

const CartPage = () => {
  const navigate = useNavigate();
  const { loggedUser, isLogging, cartItems, totalAmount } = useSelector(
    (store) => store.user
  );

  //protect routing
  useEffect(() => {
    if (!isLogging || loggedUser?.role != "user") navigate("/");
  }, [loggedUser, isLogging, navigate]);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        <div className="flex items-center gap-[20px] mb-6 mt-18">
          <div className="z-[10]">
            <IoIosArrowRoundBack
              onClick={() => {
                navigate("/");
              }}
              size={35}
              className="text-[#ff4d2d] cursor-pointer"
            />
          </div>
          <h1 className="text-2xl font-bold text-start">Your Cart</h1>
        </div>
        {cartItems?.length == 0 ? (
          <p className="text-red-500 text-center">Your Cart Is Empty</p>
        ) : (
          <div className="">
            {cartItems.map((item, idx) => (
              <CartItem key={idx} data={item} />
            ))}
            <div className="mt-6 bg-white p-2 rounded-xl shadow flex justify-between items-center border">
              {/* Total Amount */}
              <div className="flex  items-center gap-2">
                <h1 className="text-gray-700 text-sm sm:text-lg font-medium">
                  Total Amount
                </h1>
                <p className=" font-bold text-[#ff4d2d] text-sm sm:text-lg">
                  ₹{totalAmount}
                </p>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate("/check-out")}
                className=" sm:py-2 sm:px-3 p-1 text-sm sm:text-md rounded-2xl bg-[#ff4d2d] text-white font-semibold hover:bg-[#e04326] transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
