import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import {
  setAddToCartAfterLogout,
  setIsLogging,
  setLoggedUser,
  setSearchItems,
  setShop,
} from "../redux/slices/userSlice";
import { FaPlus } from "react-icons/fa6";
import { GiReceiveMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { setAddress } from "../redux/slices/mapSlice";

function Nav() {
  const dispatch = useDispatch();
  const naviget = useNavigate();
  const { loggedUser, city, shop, cartItems } = useSelector(
    (store) => store.user
  );
  const [profilepop, setProfilepop] = useState(false);
  const [showSeacrh, setShowSearch] = useState(false);
  const [query, setQuery] = useState([]);

 

  //search api
  useEffect(() => {
    if (query.length == 0) {
      dispatch(setSearchItems([]));
      return;
    }
    const fetchItems = async () => {
      try {
        const res = await instance.get(
          `/item/search-items?query=${query}&city=${loggedUser?.city}`
        );
        if (res?.data?.success) {
          dispatch(setSearchItems(res?.data?.items));
        }
      } catch (error) {
        console.error(error);
        dispatch(setSearchItems([]));
      }
    };

    if (query) {
      fetchItems();
    }
  }, [query, loggedUser?.city, dispatch]);

  const logOutHandler = async () => {
    try {
      const res = await instance.get("/auth/logout");
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setIsLogging(false));
        dispatch(setLoggedUser(null));
        dispatch(dispatch(setShop(null)));
        dispatch(setAddToCartAfterLogout([]));
        dispatch(setAddress(null));
      }
    } catch (error) {
      toast.error(error.response.data.message || "Logout error");
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-[#fff9f6] overflow-visible">
      {/* modile Search */}
      {showSeacrh && loggedUser?.role != "owner" && (
        <div className="h-[70px] w-[90%] fixed md:hidden top-[80px] flex bg-white shadow-xl rounded-lg items-center gap-[20px]">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot className="w-[25px] h-[25px] text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">
              {loggedUser?.city || city}
            </div>
          </div>
          <div className="w-[80%] flex items-center gap-1">
            <FaSearch size={25} className="text-[#ff4d2d]" />
            <input
              type="text"
              className="px-[10px] text-gray-700 outline-0 w-full"
              placeholder="Search Delisious Food..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}
      <h1
        onClick={() => naviget("/")}
        className="text-3xl font-bold mb-2 text-[#ff4d2d] cursor-pointer"
      >
        Foodingo
      </h1>
      {/* md device search */}
      {loggedUser?.role != "owner" && loggedUser?.role != "deliveryBoy" && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px] md:flex hidden bg-white shadow-xl rounded-lg items-center gap-[20px]">
          <div className="flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] border-gray-400">
            <FaLocationDot className="w-[25px] h-[25px] text-[#ff4d2d]" />
            <div className="w-[80%] truncate text-gray-600">
              {loggedUser?.city || city}
            </div>
          </div>
          <div className="w-[80%] flex items-center gap-1">
            <FaSearch className="text-[#ff4d2d]" />
            <input
              type="text"
              className="px-[10px] text-gray-700 outline-0 w-full"
              placeholder="Search Delisious Food..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        {loggedUser?.role != "owner" && loggedUser?.role != "deliveryBoy" && (
          <>
            {/* mobile button search*/}
            <FaSearch
              onClick={() => setShowSearch((p) => !p)}
              size={25}
              className="text-[#ff4d2d] md:hidden"
            />
            {/* cart md + mobile */}
            <div
              onClick={() => naviget("/cart")}
              className=" relative cursor-pointer text-[#ff4d2d]"
            >
              <FaCartArrowDown size={25} />
              <span className=" absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
                {cartItems?.length || 0}
              </span>
            </div>
            {/* Md device button*/}
            <button
              onClick={() => naviget("/my-oredrs")}
              className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer"
            >
              My Order
            </button>
          </>
        )}
        {loggedUser?.role == "owner" && (
          <>
            {/* mobile icon button add item*/}
            {shop != undefined && (
              <>
                <FaPlus
                  onClick={() => naviget("/add-food")}
                  className=" bg-[#ff4d2d]/10 text-[#ff4d2d] p-1 rounded-3xl md:hidden cursor-pointer"
                  size={25}
                />
                {/* md  button add item*/}
                <button
                  onClick={() => naviget("/add-food")}
                  className="hidden md:block pl-5 pr-2 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium relative cursor-pointer"
                >
                  <FaPlus className=" absolute  left-1 bottom-1.5" />
                  Add Food Item
                </button>
              </>
            )}
            {/* mobile icon button  owner My Order*/}
            <div className=" relative">
              <GiReceiveMoney
                onClick={() => naviget("/my-oredrs")}
                className=" bg-[#ff4d2d]/10 text-[#ff4d2d] p-1 rounded-3xl md:hidden cursor-pointer"
                size={25}
              />
            </div>
            {/* md button  owner My Order*/}
            <div className=" relative">
              <button
                onClick={() => naviget("/my-oredrs")}
                className="hidden md:block pl-5 pr-2 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium relative cursor-pointer"
              >
                <GiReceiveMoney className=" absolute  left-1 bottom-1.5" />
                My Order
              </button>
            </div>
          </>
        )}

        {loggedUser?.role == "deliveryBoy" && (
          <>
            <div className=" relative">
              <GiReceiveMoney
                onClick={() => naviget("/my-oredrs")}
                className=" bg-[#ff4d2d]/10 text-[#ff4d2d] p-1 rounded-3xl md:hidden cursor-pointer"
                size={25}
              />
            </div>
            {/* md button  owner My Order*/}
            <div className=" relative">
              <button
                onClick={() => naviget("/my-oredrs")}
                className="hidden md:block pl-5 pr-2 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium relative cursor-pointer"
              >
                <GiReceiveMoney className=" absolute  left-1 bottom-1.5" />
                My Order
              </button>
            </div>
          </>
        )}
        <div
          onClick={() => setProfilepop((prev) => !prev)}
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
        >
          {loggedUser?.fullName.slice(0, 1)}
        </div>
        {profilepop && (
          <div className=" fixed top-[80px] right-[10px] md:right-[10%] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[14px] font-semibold flex items-center justify-between">
              {" "}
              {loggedUser?.fullName}{" "}
              <RxCross2
                className=" cursor-pointer"
                size={17}
                onClick={() => setProfilepop((prev) => !prev)}
              />
            </div>
            <div
              onClick={logOutHandler}
              className="text-[#ff4d2d] text-sm font-semibold hover:bg-[#ff4d2d]/10 p-1 rounded-lg cursor-pointer pl-2"
            >
              Logout
            </div>
            {loggedUser?.role != "owner" && (
              <div
                onClick={() => naviget("/my-oredrs")}
                className="text-[#ff4d2d] text-sm font-semibold hover:bg-[#ff4d2d]/10 p-1 rounded-lg md:hidden cursor-pointer pl-2"
              >
                My Orders
              </div>
            )}
            {loggedUser?.role == "owner" && (
              <>
                <div className="text-[#ff4d2d] text-sm font-semibold hover:bg-[#ff4d2d]/10 p-1 rounded-lg md:hidden cursor-pointer pl-2">
                  Panding Order
                </div>
                <div
                  onClick={() => naviget("/create-edit-shop")}
                  className="text-[#ff4d2d] text-sm font-semibold hover:bg-[#ff4d2d]/10 p-1 rounded-lg  cursor-pointer pl-2"
                >
                  Edit Shop
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
