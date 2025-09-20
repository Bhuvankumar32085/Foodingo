import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setItems, setSelectedOwnerItem } from "../redux/slices/itemSlice";
import { toast } from "react-toastify";
import { setShop } from "../redux/slices/userSlice";
import instance from "../axios/axios";
import { ImSpinner11 } from "react-icons/im";
import { useState } from "react";

const OwnerItemCard = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const foodTypeColor =
    data?.foodType == "veg" ? " bg-green-600" : "bg-red-600";

  const deleteItemHandler = async () => {
    setLoading(true);
    try {
      const res = await instance.delete(`/item/delete-item/${data?._id}`);
      if (res?.data?.success) {
        toast.success(res.data?.message);
        dispatch(dispatch(setShop(res.data?.shop)));
        dispatch(setItems(res.data?.shop?.items));
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Delete Item error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" relative flex flex-col sm:flex-row bg-white rounded-2xl shadow-md hover:shadow-lg border border-[#ff4d2d]/60 w-full max-w-3xl overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {/* Image Section */}
      <div className="sm:w-40 w-full h-40 sm:h-auto flex-shrink-0 bg-gray-100">
        <img
          src={data?.image}
          alt={data?.name || "Item"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-4 flex-1">
        {/* Title & Details */}
        <div>
          <h1 className="text-lg font-semibold text-[#ff4d2d] line-clamp-1 ">
            {data?.name}
          </h1>
          <p className="text-sm text-gray-900">
            Category : <span className="text-gray-600">{data?.category}</span>
          </p>
          <div className="text-sm  text-gray-900">
            Food Type :{" "}
            <span className="text-gray-600 relative pl-3">
              {data?.foodType}{" "}
              <div
                className={`w-2 h-2 rounded-2xl ${foodTypeColor} absolute left-0 top-2`}
              ></div>
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-3">
          <p className="text-xl font-bold text-[#ff4d2d]">
            Price : <span>₹{data?.price}</span>
          </p>
        </div>

        {/* edit delete button */}
        <div className="flex gap-2">
          <CiEdit
            onClick={() => {
              navigate("/edit-item"), dispatch(setSelectedOwnerItem(data));
            }}
            className="bg-[#ff4d2d] hover:bg-orange-700 text-white p-1 rounded-2xl cursor-pointer md:w-[25px] md:h-[25px] w-[20px] h-[20px] absolute top-2 z-[10] right-8 md:right-10"
          />
          {loading ? (
            <ImSpinner11 className="bg-[#ff4d2d] hover:bg-orange-700 text-white p-1 rounded-2xl cursor-pointer md:w-[25px] md:h-[25px] w-[20px] h-[20px] absolute top-2 z-[10] right-2 animate-spin" />
          ) : (
            <MdDelete
              onClick={deleteItemHandler}
              className="bg-[#ff4d2d] hover:bg-orange-700 text-white p-1 rounded-2xl cursor-pointer md:w-[25px] md:h-[25px] w-[20px] h-[20px] absolute top-2 z-[10] right-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
