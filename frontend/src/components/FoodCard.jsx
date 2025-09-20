import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setAddtoCart } from "../redux/slices/userSlice";
import { toast } from "react-toastify";

const FoodCard = ({ data}) => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.user);
  const [quantity, setQuantity] = useState(1);
  //change cart color
  const dataExistsInCart = cartItems.some((i) => i.id === data?._id);
  const dataExistsCartThenColor = dataExistsInCart
    ? "bg-green-500"
    : "bg-[#ff4d2d]";

  const renderRatingStar = (rating) => {
    const starArray = [];
    for (let i = 0; i < 5; i++) {
      starArray.push(
        i < rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        )
      );
    }
    return starArray;
  };

  return (
    <div className="w-[200px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className=" relative w-full h-[120px] flex justify-center items-center bg-white">
        <div className=" absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data?.foodType == "veg" ? (
            <FaLeaf className="text-green-400" />
          ) : (
            <FaDrumstickBite className="text-red-600" />
          )}
        </div>
        <img
          src={data?.image}
          alt="image"
          className=" w-full object-cover h-full"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data?.name}
        </h1>
        <div className="flex items-center gap-1 mt-1">
          {renderRatingStar(data?.rating?.average || 0)}
          <span className="text-gray-500 text-xs">
            {data?.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-4">
        <span className="font-bold text-gray-900 text-lg">{data?.price}</span>
        <div className="flex items-center border rounded-full overflow-hidden shadow-sm">
          <button
            onClick={() => setQuantity((p) => (p > 1 ? p - 1 : 1))}
            className="px-2 py-2 hover:bg-gray-100 transition"
          >
            <FaMinus size={12} />
          </button>

          <span>{quantity}</span>
          <button
            onClick={() => setQuantity((p) => p + 1)}
            className="px-2 py-2 hover:bg-gray-100 transition"
          >
            <FaPlus size={12} />
          </button>
          <button
            onClick={() => {
              dispatch(
                setAddtoCart({
                  id: data?._id,
                  name: data?.name,
                  price: data?.price,
                  image: data?.image,
                  shop: data?.shop,
                  quantity: quantity,
                  foodType: data?.foodType,
                }),
                toast.success("Add item In Cart")
              );
            }}
            className={`${dataExistsCartThenColor} text-white px-3 py-2 transition-colors`}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
