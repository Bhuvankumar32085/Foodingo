import { FaMinus, FaPlus } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { setQuantity, setRemoveCartItem } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

const CartItem = ({ data }) => {
  const dispatch = useDispatch();

  const handleDecrease = (id, cuquantity) => {
    if (cuquantity == 1) return;
    dispatch(setQuantity({ id, quantity: (cuquantity -= 1) }));
  };

  const handleIncrease = (id, cuquantity) => {
    dispatch(setQuantity({ id, quantity: (cuquantity += 1) }));
  };

  return (
    <div className="w-full flex items-center justify-center px-3 py-4">
      <div className="w-full max-w-2xl bg-white shadow-xl hover:shadow-2xl rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300">
        {/* Cart Item */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex gap-4">
            <img
              src={data?.image}
              alt={data?.name}
              className="object-cover sm:w-24 sm:h-24 w-20 h-20 rounded-2xl border"
            />
            <div className="flex flex-col justify-between">
              <h1 className="font-semibold text-lg">{data?.name}</h1>
              <p className="text-gray-500 text-sm">
                ₹{data?.price} × {data?.quantity}
              </p>
              <p className="font-bold text-md text-[#ff4d2d]">
                ₹{data?.price * data?.quantity}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex sm:items-center gap-3 justify-center">
            <button
              onClick={() => handleDecrease(data?.id, data?.quantity)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaMinus className="text-gray-600 text-sm cursor-pointer" />
            </button>
            <p className="text-lg font-semibold">{data?.quantity}</p>
            <button
              onClick={() => handleIncrease(data?.id, data?.quantity)}
              className="p-2 rounded-full bg-[#ff4d2d] text-white hover:bg-[#e04326] transition cursor-pointer"
            >
              <FaPlus className="text-sm" />
            </button>
            <button
              onClick={() => dispatch(setRemoveCartItem({ id: data?.id }))}
              className="p-2 rounded-full bg-[#ff4d2d] text-white hover:bg-[#e04326] transition cursor-pointer"
            >
              <IoTrash className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
