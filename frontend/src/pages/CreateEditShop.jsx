import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import { ImSpinner11 } from "react-icons/im";
import { setShop } from "../redux/slices/userSlice";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogging, shop, loggedUser } = useSelector((store) => store.user);


  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: shop?.name || "",
    city: shop?.city || "",
    state: shop?.state || "",
    address: shop?.address || "",
  });
  const [frontedImage, setFrontendImage] = useState(shop?.image || null);
  const [backendImage, setBackendImage] = useState(null);


  useEffect(() => {
    if (!isLogging || loggedUser?.role != "owner") {
      navigate("/");
    }
  }, [isLogging, navigate, loggedUser]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const imageHandler = (e) => {
    const file = e.target?.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    const action = shop == undefined ? "create" : "edit";
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData?.name);
      data.append("city", formData?.city);
      data.append("address", formData?.address);
      data.append("state", formData?.state);
      if (backendImage) {
        data.append("image", backendImage);
      }
      const res = await instance.post(`/shop/${action}`, data);
      if (res?.data?.success) {
        toast.success(res.data?.message);
        dispatch(dispatch(setShop(res.data?.shop)));
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "add shop error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen mt-15">
      <div className=" absolute md:top-[70px] md:left-[20px] z-[10] mb-[10px] top-[90px] left-[25px]">
        <IoIosArrowRoundBack
          onClick={() => navigate("/")}
          size={35}
          className="text-[#ff4d2d] cursor-pointer"
        />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {shop != undefined ? <div>Edit Shop</div> : <div>Add Shop</div>}
          </div>
        </div>

        <form onSubmit={submitHandler} className=" space-y-5">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={changeHandler}
              value={formData.name}
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="image"
            >
              Shop Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={imageHandler}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
            />
            {frontedImage && (
              <div className="mt-4">
                <img src={frontedImage} className="w-full h-48 object-cover" />
              </div>
            )}
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="city"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                onChange={changeHandler}
                value={formData.city}
                placeholder="Enter Your City"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="state"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                onChange={changeHandler}
                value={formData.state}
                placeholder="Enter Your State"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="address"
            >
              Addresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              onChange={changeHandler}
              value={formData.address}
              placeholder="Enter Your Addresse"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
            />
          </div>
          <button className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all cursor-pointer">
            {loading ? (
              <ImSpinner11 className=" animate-spin mx-auto" />
            ) : (
              "Save"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
