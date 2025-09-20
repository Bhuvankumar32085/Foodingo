import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import DeliveryBoyTraking from "./DeliveryBoyTraking";
import { socket } from "../../socket";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DeliveryBoyDashboard = () => {
  const [availableAssignment, setAvailableAssignment] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState({});
  const [todayDelivery, setTodayDelivery] = useState([]);

  const getAssignment = async () => {
    try {
      const res = await instance.get("/order/get-assignment");
      if (res.data?.success) {
        setAvailableAssignment(res.data?.formatedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptOrder = async (assignmentId) => {
    try {
      const res = await instance.get(`/order/accept-order/${assignmentId}`);
      if (res.data?.success) {
        toast.success(res.data?.message);
        await getCurrentOrder();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const res = await instance.get(`/order/get-current-order`);
      if (res.data?.success) {
        setCurrentOrder(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAssignment();
    getCurrentOrder();
    handelGetDodayDelivery();
  }, []);

  const sendOtp = async (orderId, shopId) => {
    try {
      const res = await instance.post(`/order/delivered-otp`, {
        orderId,
        shopId,
      });
      if (res.data?.success) {
        toast.success(res.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const verifyOtpHandler = async (orderId, shopId) => {
    try {
      const res = await instance.post(`/order/verify-delivered-otp`, {
        otp,
        orderId,
        shopId,
      });
      if (res.data?.success) {
        toast.success(res.data?.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handelGetDodayDelivery = async () => {
    try {
      const res = await instance.get(`/order/get-today-delivery`);
      if (res.data?.success) {
        setTodayDelivery(res?.data?.hourlyStats);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const ratePerDeliver = 40;
  const TotalEarning = todayDelivery?.reduce(
    (sum, d) => sum + d.count * ratePerDeliver,
    0
  );



  useEffect(() => {
    const RTgetNewAssignment = (newAssignmentData) => {
     
      if (newAssignmentData?.sentTo == loggedUser?._id) {
        setAvailableAssignment((prev) => [...prev, newAssignmentData]);
      }
    };

    socket?.on("newAssignment", RTgetNewAssignment);
    return () => {
      socket?.off("newAssignment", RTgetNewAssignment);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || loggedUser?.role != "deliveryBoy") {
      return;
    }
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          socket.emit("updateLocationRT", {
            latitude,
            longitude,
            userId: loggedUser?._id,
          });
        },
        (err) => {
          console.log(err);
        },
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket]);

  const { loggedUser } = useSelector((store) => store.user);

  return (
    <div className="w-full min-h-screen flex flex-col gap-6 items-center bg-[#fff9f6] px-3 py-6">
      <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100 max-w-[900px]">
        <h1 className="text-lg font-semibold mb-3">Today Delivery</h1>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={todayDelivery}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
            <YAxis dataKey="count" allowDecimals={false} />
            <Tooltip
              formatter={(value) => [value, "orders"]}
              labelFormatter={(label) => `${label}:00`}
            />
            <Legend />
            <Bar dataKey="count" fill="#ff4d2d" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className=" flex max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl text-sm sm:text-lg shadow-lg justify-center gap-2">
          <h1 className=" text-[#ff4d2d]">Todays Earning</h1><span className=" text-green-500">₹{TotalEarning}</span>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-5 border border-orange-100 text-center">
        <h1 className="text-lg sm:text-xl font-bold text-[#ff4d2d] capitalize">
          Welcome {loggedUser.fullName}
        </h1>
        <p className="text-xs sm:text-sm font-semibold mt-2">
          <span className="text-[#ff4d2d]">Latitude:</span>{" "}
          {deliveryBoyLocation?.lat ||
            loggedUser?.location?.coordinates[1]?.toFixed(4)}
          ,<span className="text-[#ff4d2d]"> Longitude:</span>{" "}
          {deliveryBoyLocation?.lon ||
            loggedUser?.location?.coordinates[0]?.toFixed(4)}
        </p>
      </div>

      {/* Orders Section */}
      {!currentOrder && (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-5 border border-orange-100">
          <h1 className="text-base sm:text-lg font-bold mb-4 text-[#ff4d2d]">
            Available Orders
          </h1>

          {availableAssignment.length > 0 ? (
            <div className="flex justify-center flex-col items-center gap-4">
              {availableAssignment.map((ass, i) => (
                <div
                  className="border rounded-xl w-[90%] p-2 flex flex-col justify-between bg-white hover:shadow-md transition"
                  key={i}
                >
                  <div className="mb-3">
                    <p className="text-sm font-semibold">{ass?.shopName}</p>
                    <p
                      className="text-xs sm:text-sm text-gray-500 "
                      title={ass?.deliveryAddress?.text}
                    >
                      <span className="font-semibold">Address:</span>{" "}
                      {ass?.deliveryAddress?.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {ass?.items.length} Item | ₹{ass?.subTotal}
                    </p>
                  </div>
                  <button
                    onClick={() => acceptOrder(ass.assignmentId)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-xs sm:text-sm self-end"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              No Available Order
            </p>
          )}
        </div>
      )}

      {currentOrder && (
        <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] max-w-[900px] border border-orange-100">
          <h2 className="text-lg font-bold mb-3">💫Current Order</h2>
          <div className=" border rounded-lg p-4 mb-3">
            <p className=" font-semibold text-sm text-gray-900">
              {currentOrder?.shop?.name}
            </p>
            <p className=" font-semibold text-sm text-gray-500">
              {currentOrder?.deliveryAddress?.text}
            </p>
            <p className=" font-semibold text-sm text-gray-500">
              {currentOrder?.shopOrder?.shopOrderItem?.length} Item |{" "}
              {currentOrder?.shopOrder?.subtotal}
            </p>
          </div>
          <DeliveryBoyTraking
            data={{
              deliveryBoyLocation: deliveryBoyLocation || {
                lat: loggedUser?.location?.coordinates[1],
                lon: loggedUser?.location?.coordinates[0],
              },
              customerBoyLocation: {
                lat: currentOrder.deliveryAddress.latitude,
                lon: currentOrder.deliveryAddress.longitude,
              },
            }}
          />
          {!showOtpBox ? (
            <button
              onClick={() => {
                setShowOtpBox(true);
                sendOtp(currentOrder._id, currentOrder.shopOrder._id);
              }}
              className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
            >
              Mark As Delivered
            </button>
          ) : (
            <div className="mt-4 p-4 border rounded-xl bg-gray-50">
              <p className="text-sm font-semibold mb-2">
                Enter Otp Send to{" "}
                <span className="text-[#ff4d2d]">
                  {currentOrder?.user?.fullName}
                </span>
              </p>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className=" w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                onClick={() =>
                  verifyOtpHandler(currentOrder._id, currentOrder.shopOrder._id)
                }
                className=" w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-all"
              >
                Submit Otp
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeliveryBoyDashboard;
