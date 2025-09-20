import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import instance from "../axios/axios";
import { toast } from "react-toastify";
import { ImSpinner11 } from "react-icons/im";
import { setShop } from "../redux/slices/userSlice";
import { setItems, setSelectedOwnerItem } from "../redux/slices/itemSlice";

const EditItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLogging, loggedUser } = useSelector((store) => store.user);
  const { selectedOwnerItem } = useSelector((store) => store.item);

  const categoryType = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const foodTypeEnum = ["veg", "non veg"];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: selectedOwnerItem?.name || "",
    category: selectedOwnerItem?.category || "",
    price: selectedOwnerItem?.price || 0,
    foodType: selectedOwnerItem?.foodType || "",
  });
  const [frontedImage, setFrontendImage] = useState(
    selectedOwnerItem?.image || null
  );
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
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData?.name);
      data.append("category", formData?.category);
      data.append("price", formData?.price);
      data.append("foodType", formData?.foodType);
      if (backendImage) {
        data.append("image", backendImage);
      }
      const res = await instance.put(
        `/item/edit-item/${selectedOwnerItem?._id}`,
        data
      );
      if (res?.data?.success) {
        toast.success(res.data?.message);
        dispatch(dispatch(setShop(res.data?.shop)));
        dispatch(setItems(res.data?.shop?.items));
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Edit Item error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen mt-15">
      <div className=" absolute md:top-[70px] md:left-[20px] z-[10] mb-[10px] top-[90px] left-[25px]">
        <IoIosArrowRoundBack
          onClick={() => {
            navigate("/"), dispatch(setSelectedOwnerItem(null));
          }}
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
            Edit Food Item
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
              placeholder="Enter Item Name"
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
                htmlFor="category"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                onChange={changeHandler}
                value={formData.category}
                placeholder="Enter Your Item Category"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              >
                <option value="">Select Category</option>
                {categoryType.map((data, idx) => (
                  <option key={idx} value={data}>
                    {data}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="price"
              >
                Price
              </label>
              <input
                type="number"
                min={0}
                id="price"
                name="price"
                onChange={changeHandler}
                value={formData.price}
                placeholder="Enter Your Item Price"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="foodType"
            >
              Food Type
            </label>
            <select
              type="text"
              id="foodType"
              name="foodType"
              onChange={changeHandler}
              value={formData.foodType}
              placeholder="Enter Your  Food Type"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-orange-500"
            >
              <option value="">Select Food Type</option>
              {foodTypeEnum.map((data, idx) => (
                <option key={idx} value={data}>
                  {data}
                </option>
              ))}
            </select>
          </div>
          <button
            disabled={loading}
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all cursor-pointer"
          >
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

export default EditItem;
