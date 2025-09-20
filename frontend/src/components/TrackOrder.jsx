import { useEffect, useState } from "react";
import instance from "../axios/axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTraking from "./DeliveryBoyTraking";
import { socket } from "../../socket";

const TrackOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const [livelocation, setLiveLocation] = useState({});

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await instance.get(`/order/get-order/${orderId}`);
        if (res.data.success) {
          setCurrentOrder(res.data.order);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    socket.on(
      "deliveryLocationRT",
      ({ deliveryBoyId, latitude, longitude }) => {
        setLiveLocation((prev) => ({
          ...prev,
          [deliveryBoyId]: {
            lat: latitude,
            lon: longitude,
          },
        }));
      }
    );

    return () => {
      socket.off("deliveryLocationRT");
    };
  }, [socket]);


  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Back button + heading */}
      <div className=" absolute top-20 left-2 flex items-center gap-2  p-2 rounded-xl  z-10">
        <IoIosArrowRoundBack
          onClick={() => navigate("/my-oredrs")}
          size={32}
          className="text-[#ff4d2d] cursor-pointer hover:scale-110 transition"
        />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#ff4d2d]">
          Track Order
        </h1>
      </div>

      {/* Orders */}
      <div className="mt-24 space-y-6">
        {currentOrder?.shopOrders?.map((shopOrder, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-md border border-orange-100 hover:shadow-lg transition"
          >
            {/* Shop Name */}
            <h2 className="text-xl font-bold text-[#ff4d2d] mb-2">
              {shopOrder?.shop?.name}
            </h2>

            {/* Items */}
            <div className="flex flex-wrap gap-2 text-sm sm:text-base mb-3">
              <span className="text-[#ff4d2d] font-semibold">Items:</span>
              <div className="flex flex-wrap gap-2">
                {shopOrder?.shopOrderItem?.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs sm:text-sm"
                  >
                    {item?.item?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtotal + Address */}
            <div className="grid gap-2 sm:grid-cols-2 text-sm sm:text-base">
              <p>
                <span className="font-semibold">SubTotal:</span> ₹
                {shopOrder?.subtotal}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Delivery Address:</span>{" "}
                {currentOrder?.deliveryAddress?.text}
              </p>
            </div>

            {/* Delivery Section */}
            <div className="mt-4">
              {shopOrder.status !== "delivered" ? (
                <>
                  <h3 className="font-semibold text-lg mb-2">Delivery Boy</h3>
                  {shopOrder?.assignDeliveryBoy ? (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="font-medium">
                        {shopOrder?.assignDeliveryBoy?.fullName}
                      </p>
                      <p className="text-sm text-gray-700">
                        📱 {shopOrder?.assignDeliveryBoy?.mobile}
                      </p>
                      <p className="text-sm text-gray-700">
                        ✉️ {shopOrder?.assignDeliveryBoy?.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        📍 lat{" "}
                        {shopOrder?.assignDeliveryBoy?.location?.coordinates[1]}{" "}
                        | lon{" "}
                        {shopOrder?.assignDeliveryBoy?.location?.coordinates[0]}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Not assigned yet</p>
                  )}

                  {shopOrder?.assignDeliveryBoy && (
                    <div className=" h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                      <DeliveryBoyTraking
                        data={{
                          deliveryBoyLocation: livelocation[
                            shopOrder?.assignDeliveryBoy._id
                          ] || {
                            lat: shopOrder?.assignDeliveryBoy?.location
                              ?.coordinates[1],
                            lon: shopOrder?.assignDeliveryBoy?.location
                              ?.coordinates[0],
                          },
                          customerBoyLocation: {
                            lat: currentOrder.deliveryAddress.latitude,
                            lon: currentOrder.deliveryAddress.longitude,
                          },
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <p className="text-green-600 font-bold text-lg">✅ Delivered</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
