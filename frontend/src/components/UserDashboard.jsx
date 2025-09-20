import { useEffect, useState } from "react";
import { categories } from "../category";
import CategoryVard from "./CategoryVard";
import { CiCircleChevRight } from "react-icons/ci";
import { CiCircleChevLeft } from "react-icons/ci";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import instance from "../axios/axios";
import { setLoggedUser } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { ImSpinner11 } from "react-icons/im";
import { useGetShopByCity } from "../hooks/useGetShopByCity";
import ShopCardFromUserSide from "./ShopCardFromUserSide";
import FoodCard from "./FoodCard";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { loggedUser, isLogging, getShopsByCity, searchItems } = useSelector(
    (store) => store.user
  );

  //get shop by city -->
  useGetShopByCity(isLogging, loggedUser?.role, loggedUser?.city);

  const cateRef = useRef();
  const [showCateLeftRef, setShowLeftCateRef] = useState(false);
  const [showCateRightRef, setShowRightCateRef] = useState(false);
  const [loading, setLoading] = useState(false);
  const itemInMycity = getShopsByCity?.flatMap((restaurant) => restaurant.items);
  const [updatedItemList, setUpdatedItemList] = useState(itemInMycity);


  const hendelFilterByCategery = (category) => {
    if (category == "All") {
      setUpdatedItemList(itemInMycity);
      toast.success(`Filter ${category}`);
    } else {
      const filterList = itemInMycity.filter((i) => i.category == category);
      setUpdatedItemList(filterList);
      toast.success(`Filter ${category}`);
    }
  };

  const getItemByShop = async (shopId) => {
    try {
      const res = await instance.get(`/item/get-items-by-shop/${shopId}`);
      if (res?.data?.success) {
        setUpdatedItemList(res.data.shopItem);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const [userInformation, setUserInformation] = useState({
    city: "",
    address: "",
    state: "",
    district: "",
  });

  const changeHandler = (e) => {
    setUserInformation({ ...userInformation, [e.target.name]: e.target.value });
  };

  const infoSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await instance.post("/user/add-location", userInformation);
      if (res?.data?.success) {
        dispatch(setLoggedUser(res?.data?.user));
        // dispatch(setAddress(res?.data?.user?.address))
      }
    } catch (error) {
      // console.error(error)
      toast.error(error.response.data.message || "Add Information Error");
    } finally {
      setLoading(false);
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  const updateButton = (ref, setLeftCateRef, setRightCateRef) => {
    const element = ref.current;
    if (element) {
      setRightCateRef(
        element.scrollWidth > element.clientWidth + element.scrollLeft
          ? true
          : false
      );
      setLeftCateRef(element.scrollLeft > 0 ? true : false);
    }
  };

  useEffect(() => {
    if (cateRef.current) {
      cateRef.current.addEventListener("scroll", () => {
        updateButton(cateRef, setShowLeftCateRef, setShowRightCateRef);
      });
    }
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col  items-center bg-[#fff9f6] overflow-y-auto">
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-[#ff4d2d] text-xl sm:text-2xl font-semibold">
          Inspiration for your first order
        </h1>
        <div className="w-full flex justify-center">
          {showCateLeftRef && (
            <button onClick={() => scrollHandler(cateRef, "left")}>
              <CiCircleChevLeft
                className=" cursor-pointer mr-2 bg-[#ff4d2d] hover:bg-[#e64528] text-white rounded-full"
                size={25}
              />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-[#ff4d2d] scrollbar-track-transparent scroll-smooth"
            ref={cateRef}
          >
            {categories?.map((cate, idx) => (
              <CategoryVard
                key={idx}
                data={cate}
                hendelFilterByCategery={hendelFilterByCategery}
              />
            ))}
          </div>
          {showCateRightRef && (
            <button onClick={() => scrollHandler(cateRef, "right")}>
              <CiCircleChevRight
                className=" cursor-pointer ml-2 bg-[#ff4d2d] hover:bg-[#e64528] text-white rounded-full"
                size={25}
              />
            </button>
          )}
        </div>
      </div>

      {loggedUser?.city == undefined ? (
        <div className="w-full flex items-center justify-center px-4">
          <form
            onSubmit={infoSubmitHandler}
            className="flex flex-col w-full max-w-lg shadow-xl p-6 sm:p-8 rounded-2xl bg-white hover:shadow-2xl transition-shadow"
          >
            <h1 className="text-[#ff4d2d] text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center">
              Please Enter Your Information for Better Search
            </h1>

            {/* City */}
            <div className="mb-4">
              <label
                className="block text-sm sm:text-base text-gray-700 font-semibold mb-1"
                htmlFor="city"
              >
                City :
              </label>
              <input
                id="city"
                type="text"
                name="city"
                onChange={changeHandler}
                value={userInformation.city}
                placeholder="Enter Your City"
                className="border w-full rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              />
            </div>

            {/* State */}
            <div className="mb-4">
              <label
                className="block text-sm sm:text-base text-gray-700 font-semibold mb-1"
                htmlFor="state"
              >
                State :
              </label>
              <input
                id="state"
                type="text"
                name="state"
                onChange={changeHandler}
                value={userInformation.state}
                placeholder="Enter Your State"
                className="border w-full rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label
                className="block text-sm sm:text-base text-gray-700 font-semibold mb-1"
                htmlFor="address"
              >
                Address :
              </label>
              <input
                id="address"
                type="text"
                name="address"
                onChange={changeHandler}
                value={userInformation.address}
                placeholder="Enter Your Address"
                className="border w-full rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              />
            </div>

            {/* District */}
            <div className="mb-6">
              <label
                className="block text-sm sm:text-base text-gray-700 font-semibold mb-1"
                htmlFor="district"
              >
                District :
              </label>
              <input
                id="district"
                type="text"
                name="district"
                onChange={changeHandler}
                value={userInformation.district}
                placeholder="Enter Your District"
                className="border w-full rounded-lg p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white rounded-xl py-2 sm:py-3 font-medium hover:bg-[#e6401f] transition-colors"
            >
              {loading ? (
                <ImSpinner11 className="mx-auto animate-spin" />
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
            <h1 className="text-[#ff4d2d] text-xl sm:text-2xl font-semibold">
              {getShopsByCity?.length} Best Shop In Your {loggedUser?.city}
            </h1>
            <div className="w-full flex justify-center px-6">
              <div className="w-full flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-[#ff4d2d] scrollbar-track-transparent scroll-smooth">
                {getShopsByCity?.map((shop, idx) => (
                  <ShopCardFromUserSide
                    getItemByShop={getItemByShop}
                    key={idx}
                    data={shop}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
            <h1 className="text-[#ff4d2d] text-xl sm:text-2xl font-semibold">
              Suggested Food Items
            </h1>

            <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
              {searchItems?.length > 0
                ? searchItems?.map((i, idx) => <FoodCard key={idx} data={i} />)
                : updatedItemList?.map((i, idx) => (
                    <FoodCard key={idx} data={i} />
                  ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;
