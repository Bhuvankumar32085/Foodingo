import { useNavigate } from "react-router-dom";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { FaRegStar } from "react-icons/fa";

const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});

  const fromatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handelRating = async (itemId, rating) => {
    try {
      const res = await instance.post("/item/rating", {
        itemId,
        rating,
      });
      if (res?.data?.success) {
        setSelectedRating((p) => ({
          ...p,
          [itemId]: rating,
        }));
        toast.success(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrderHandler = async (orderId) => {
    try {
      const res = await instance.delete("/order/delete", { data: { orderId } });
      if (res?.data?.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {data?.paymentMethod == "online" && data?.payment == false && (
        <div className="flex items-center justify-between">
          <p className="text-red-500 text-[10px]">Your Order Not Verified </p>
          <button
            onClick={() => deleteOrderHandler(data?._id)}
            className="text-[12px] bg-red-500 p-1 rounded-md text-white cursor-pointer focus:ring-red-600"
          >
            Delete
          </button>
        </div>
      )}
      <div className=" flex justify-between border-b pb-2">
        <div>
          <p className=" font-semibold">order #{data._id?.substring(15)}</p>
          <p className=" text-sm text-gray-500">
            Date: {fromatDate(data.createdAt)}
          </p>
        </div>
        <div className=" text-right">
          <p className=" text-sm text-gray-500">
            {data.paymentMethod?.toUpperCase()}
          </p>
          <p className=" text-sm text-blue-500 ">
            {data.shopOrders?.[0]?.status}
          </p>
        </div>
      </div>

      {Array.isArray(data?.shopOrders) &&
        data.shopOrders.map((shopOrder, i) => (
          <div className="border rounded-lg p-3 bg-[#fffaf7] space-y-3" key={i}>
            <p>{shopOrder.shop?.name}</p>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {Array.isArray(shopOrder?.shopOrderItem) &&
                shopOrder.shopOrderItem.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                  >
                    <img
                      src={item?.item?.image}
                      alt="image"
                      className="w-full h-24 rounded object-cover"
                    />
                    <p className="text-sm font-semibold mt-1">{item?.name}</p>
                    <p className="text-xs text-red-500">
                      {item?.quantity} x ₹{item?.price}
                    </p>
                    {shopOrder?.status == "delivered" && (
                      <div className=" flex space-x-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star,i) => (
                          <button
                            key={i}
                            onClick={()=>handelRating(item?.item?._id,star)}
                            className={`text-lg ${
                              selectedRating[item?.item?._id] >= star
                                ? "text-yellow-500"
                                : "text-gray-400"
                            }`}
                          >
                            <FaRegStar size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className="flex justify-between items-center border-t pb-2">
              <p className="font-semibold">Subtotal: {shopOrder?.subtotal}</p>
              <span className="text-sm text-blue-500">
                Status: {shopOrder?.status}
              </span>
            </div>
          </div>
        ))}

      <div className=" flex items-center justify-between p-2 border-t">
        <p className=" font-semibold">Total: ₹{data?.totalAmount}</p>
        {data?.paymentMethod == "online" && data?.payment == true && (
          <button
            onClickCapture={() => navigate(`/track-order/${data._id}`)}
            className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm"
          >
            Track Order
          </button>
        )}
        {data?.paymentMethod == "cod" && (
          <button
            onClickCapture={() => navigate(`/track-order/${data._id}`)}
            className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm"
          >
            Track Order
          </button>
        )}
      </div>
    </div>
  );
};

export default UserOrderCard;
