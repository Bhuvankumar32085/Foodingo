import { useEffect, useState } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUpdateStatus } from "../redux/slices/userSlice";

const OwnerOrderCard = ({ data }) => {
  const dispatch = useDispatch();
  const enumArray = ["pending", "preparing", "out of delivery"];
  const [status, setSatatus] = useState(data.shopOrders.status);
  const [availableBoys, setAvailableBoys] = useState([]);


  useEffect(() => {
    setSatatus(data.shopOrders.status);
  }, [data]);

  const handleUpdateStatus = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === "Change") return;
    setSatatus(e.target.value);
    const apiData = {
      orderId: data._id,
      status: newStatus,
      shopId: data.shopOrders.shop._id,
    };

    // api call hear
    try {
      const res = await instance.put("/order/update-status", apiData);
      if (res.data?.success) {
        toast.success(res.data?.message);
        setAvailableBoys(res.data?.availableBoys);
        dispatch(
          setUpdateStatus({
            orderId: data._id,
            shopId: data.shopOrders.shop._id,
            status: newStatus,
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Update Status Error");
    }
  };


  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data?.user?.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data?.user?.email}</p>
        <div className=" flex gap-2 text-sm text-gray-600 mt-1 items-center">
          <FaMobileAlt />
          <p>{data?.user?.mobile}</p>
        </div>
        <div className="flex items-center gap-2 mt-1 overflow-ellipsis text-gray-500 text-sm">
          <FaMapLocationDot />
          {data?.deliveryAddress?.text}
        </div>
        {data?.paymentMethod == "online" ? (
          <p className="text-sm text-gray-500">
            Payment : {data?.payment ? "True" : "False"}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Payment Method :- {data?.paymentMethod}
          </p>
        )}
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {data.shopOrders?.shopOrderItem?.map((item, idx) => (
          <div
            key={idx}
            className=" flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
          >
            <img
              src={item?.item?.image}
              alt="image"
              className=" w-full h-24 rounded object-cover "
            />
            <p className=" text-sm font-semibold mt-1">{item?.name}</p>
            <p className=" text-xs text-red-500">
              {item?.quantity} x ₹{item?.price}
            </p>
          </div>
        ))}
      </div>

      <div className=" flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
        <span className=" text-sm ">
          Status{" "}
          <span className="font-semibold capitalize text-[#ff4d2d]">
            {data.shopOrders.status}
          </span>
        </span>

        {data.payment && data.paymentMethod == "online" && (
          <select
            value={status}
            onChange={handleUpdateStatus}
            className=" border rounded-lg px-3 py-1 text-center text-sm focus:outline-none focus:right-2 capitalize"
          >
            <option>Change</option>
            {enumArray.map((op, i) => (
              <option key={i} className=" capitalize" value={op}>
                {op}
              </option>
            ))}
          </select>
        )}
        {data.paymentMethod == "cod" && (
          <select
            value={status}
            onChange={handleUpdateStatus}
            className=" border rounded-lg px-3 py-1 text-center text-sm focus:outline-none focus:right-2 capitalize"
          >
            <option>Change</option>
            {enumArray.map((op, i) => (
              <option key={i} className=" capitalize" value={op}>
                {op}
              </option>
            ))}
          </select>
        )}
      </div>

      {data.shopOrders.status == "out of delivery" && (
        <div className="mt-3 p-2 border rounded-lg ttext-sm bg-orange-50">
          <p>Available Delivery Boys</p>
          {availableBoys.length > 0 ? (
            availableBoys.map((dboy, i) => (
              <div className="text-green-500 text-sm" key={i}>
                {dboy.name}-{dboy.mobile}
              </div>
            ))
          ) : data?.shopOrders?.assignDeliveryBoy ? (
            <p className="text-blue-500 text-sm capitalize">
              Your Delivery Accepted by{" "}
              {data.shopOrders.assignDeliveryBoy?.fullName}-
              {data.shopOrders.assignDeliveryBoy?.mobile}
            </p>
          ) : (
            <p className="text-red-500 text-sm">
              Wating For Delivery Boy to Accept
            </p>
          )}
        </div>
      )}

      <div className=" text-sm flex justify-end gap-2 font-bold">
        Total{" "}
        <span className="font-semibold capitalize text-[#ff4d2d] block">
          {data?.shopOrders?.subtotal}
        </span>
      </div>
    </div>
  );
};

export default OwnerOrderCard;
