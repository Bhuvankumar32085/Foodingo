import { useEffect } from "react";
import instance from "../axios/axios";
import { useDispatch } from "react-redux";
import { setShop } from "../redux/slices/userSlice";
import { setItems } from "../redux/slices/itemSlice";

export const useGetCurrentShop = (isLogging, role) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLogging) return;
    if (role != "owner") return;
    const fetchShop = async () => {
      try {
        const res = await instance.get("/shop/get");
        if (res.data.success) {
          dispatch(setShop(res?.data?.shop));
          dispatch(setItems(res.data?.shop?.items));
        }
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchShop();
  }, [dispatch, isLogging, role]);
};
