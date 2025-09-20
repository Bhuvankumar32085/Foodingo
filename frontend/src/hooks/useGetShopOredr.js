import { useEffect } from "react";
import instance from "../axios/axios";
import { useDispatch } from "react-redux";
import { setMyOredrs } from "../redux/slices/userSlice";

export const useGetShopOrder = (isLogging, role) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLogging) return;
    if (role != "owner") return;
    const fetchOredr = async () => {
      try {
        const res = await instance.get("/order/get-owner-order");
        if (res.data.success) {
          dispatch(setMyOredrs(res.data?.order));
        }
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
        dispatch(setMyOredrs([]));
      }
    };

    fetchOredr();
  }, [dispatch, isLogging, role]);
};
