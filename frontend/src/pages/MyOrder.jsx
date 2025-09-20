import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetOrder } from "../hooks/useGetOrderForUser";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useGetShopOrder } from "../hooks/useGetShopOredr";
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrderCard from "../components/OwnerOrderCard";
import {
  setMyOredrsPush,
  setUpdateRealTimeOrderStatus,
} from "../redux/slices/userSlice";
import { socket } from "../../socket";

const MyOrder = () => {
  const dispatch = useDispatch();
  const { loggedUser, isLogging, myOrders } = useSelector(
    (store) => store.user
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogging) navigate("/");
  }, [isLogging, navigate]);

  useGetOrder(isLogging, loggedUser?.role);
  useGetShopOrder(isLogging, loggedUser?.role);

  useEffect(() => {
    const handleCodOrder = (newdata) => {
      if (newdata?.shopOrders?.owner._id === loggedUser?._id) {
        dispatch(setMyOredrsPush(newdata));
      }
    };

    const updateRT_Statur = (statusData) => {
      if (loggedUser?._id == statusData?.userId) {
        dispatch(
          setUpdateRealTimeOrderStatus({
            orderId: statusData?.orderId,
            shopId: statusData?.shopId,
            status: statusData?.status,
          })
        );
      }
    };

    socket.on("get-cod-order", handleCodOrder);
    socket.on("update-status", updateRT_Statur);
    return () => {
      socket.off("get-cod-order", handleCodOrder);
      socket.off("update-status", updateRT_Statur);
    };
  }, [dispatch, loggedUser]);


  return (
    <div className="min-h-screen bg-[#fff9f6] flex  justify-center w-full px-4">
      <div className="w-full max-w-[800px] p-4">
        {/* back button */}
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
          <h1 className="text-xl font-bold text-start">My Orders</h1>
        </div>

        <div className=" space-y-6">
          {myOrders.map((order, idx) =>
            loggedUser?.role == "user" ? (
              <UserOrderCard key={idx} data={order} />
            ) : loggedUser?.role == "owner" ? (
              <OwnerOrderCard key={idx} data={order} />
            ) : (
              <p>Not found page </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrder;
