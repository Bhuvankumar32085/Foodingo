import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/slices/mapSlice";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeliveryDining } from "react-icons/md";
import { CiMobile3 } from "react-icons/ci";
import { FaAddressCard } from "react-icons/fa";
import { toast } from "react-toastify";
import instance from "../axios/axios";

function RecenterMap({ location }) {
  const map = useMap();
  if (!location.lat && !location.lon) return;
  map.setView([location.lat, location.lon], 16, { animate: true });
  return null;
}

const CheckOut = () => {
  const { loggedUser, isLogging, cartItems, totalAmount } = useSelector(
    (store) => store.user
  );
  const navigate = useNavigate();
  //protect routing
  useEffect(() => {
    if (!isLogging || loggedUser?.role != "user") navigate("/");
  }, [loggedUser, isLogging, navigate]);

  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressInput, setAddressInput] = useState("");
  const dispatch = useDispatch();
  const { location, address } = useSelector((store) => store.map);
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountWithDeliveryFee = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    dispatch(
      setLocation({
        lat: e.target._latlng.lat,
        lon: e.target._latlng.lng,
      })
    );
    getAddressByLatlon();
  };

  const getAddressByLatlon = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${
          location.lon
        }&format=json&apiKey=${"d203d07c6c4c4ab6be4b2c096cd1d6a2"}`
      );

      dispatch(setAddress(res.data.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const latitude = loggedUser?.location?.coordinates[1];
      const longitude = loggedUser?.location?.coordinates[0];
      dispatch(
        setLocation({
          lat: latitude,
          lon: longitude,
        })
      );
      await getAddressByLatlon();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getLatitudeLongitudeByAddress = async () => {
    try {
      const res = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&format=json&apiKey=${"d203d07c6c4c4ab6be4b2c096cd1d6a2"}`
      );
      const latitude = res.data.results[0].lat;
      const longitude = res.data.results[0].lon;
      dispatch(setLocation({ lat: latitude, lon: longitude }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  const placeOrderHandler = async () => {
    setOrderLoading(true);
    try {
      const res = await instance.post("/order/place-order", {
        cartItems,
        paymentMethod,
        deliveryAddress: {
          text: address,
          latitude: location?.lat,
          longitude: location?.lon,
        },
        totalAmount: amountWithDeliveryFee,
      });

      if (res?.data?.success && paymentMethod == "cod") {
        toast.success(res.data?.message);
        navigate("/order-placedt");
      }

      if (res?.data?.success && paymentMethod != "cod") {
        const orderId = res.data?.orderId;
        const razorOrder = res.data?.razorOrder;
        onlinePaymentVerifyHandler(orderId, razorOrder);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Place Order Error");
    } finally {
      setOrderLoading(false);
    }
  };

  const onlinePaymentVerifyHandler = async (orderId, razorOrder) => {
    //checkout page for razorpay
    const options = {
      key: "rzp_test_RIcvaGeQNxmtd6",
      amount: razorOrder.amount, // Amount in paise (e.g., 50000 paise = ₹500)
      currency: "INR",
      name: "Foodingo",
      description: "Test Transaction",
      order_id: razorOrder.id, // Replace with the order ID
      handler: async function (response) {
        //jab razorpay ki windo open hoti or hum payment karte time pay button pr click karte to ye function chal ta h
        // You can send the response to your backend for verification
        try {
          const res = await instance.post("/order/verify-payment", {
            razorpayPaymentId: response.razorpay_payment_id, //ye response se hi milti h
            orderId,
          });
          if (res.data?.success) {
            toast.success(res.data?.message);
            navigate("/order-placedt");
          }
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message);
        }
      },

    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6 relative">
      <div className=" absolute top-[80px] left-[20px] z-[10]">
        <IoIosArrowRoundBack
          onClick={() => {
            navigate("/cart");
          }}
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
        />
      </div>
      <div className="w-full msx-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6 overflow-y-auto mt-22">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        {/* location */}
        <section className="">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800">
            <FaLocationDot className="text-[#ff4d2d]" />
            Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter your Delivery Address"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              onClick={getLatitudeLongitudeByAddress}
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center"
            >
              <FaSearch />
            </button>

            <button
              disabled={loading}
              onClick={getCurrentLocation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className=" animate-spin" />
              ) : (
                <TbCurrentLocation />
              )}
            </button>
          </div>
          <div className=" rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className="w-full h-full"
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <RecenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shodow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className=" inline-flex h-10 w-10 items-center rounded-full bg-green-100 justify-center">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className=" font-medium text-gray-800">Cash On Delivery</p>
                <p className=" text-sm text-gray-500">
                  Pay when your food arrives
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shodow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className=" inline-flex h-10 w-10 items-center rounded-full bg-purple-100 justify-center">
                <CiMobile3 className="text-purple-700 text-lg" />
              </span>
              <span className=" inline-flex h-10 w-10 items-center rounded-full bg-blue-100 justify-center">
                <FaAddressCard className="text-lg text-blue-700" />
              </span>
              <div>
                <p className=" font-medium text-gray-800">
                  UPI / Credit ? Debite Card
                </p>
                <p className=" text-sm text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Order Summary
          </h2>
          <div className=" rounded-xl border bg-gray-50 p-4 space-y-2 ">
            {cartItems?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>
                  {item?.name} x {item?.quantity}
                </span>
                <span>{item?.price * item?.quantity}₹</span>
              </div>
            ))}
            <hr className=" border-gray-200 my-2" />
            <div className="flex justify-between font-medium text-gray-800">
              <span>SabTotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-700">
              <span>Delivery Fee</span>
              <span>{deliveryFee == 0 ? "Free" : deliveryFee}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-700">
              <span>Total</span>
              <span>{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>

        <button
          disabled={orderLoading}
          className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white rounded-xl font-semibold py-3"
          onClick={placeOrderHandler}
        >
          {orderLoading ? (
            <AiOutlineLoading3Quarters className=" animate-spin mx-auto" />
          ) : paymentMethod === "cod" ? (
            "Place Order"
          ) : (
            "Pay & Place Oredr"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
