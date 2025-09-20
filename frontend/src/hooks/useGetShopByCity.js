// /get-by-city/:city

import { useEffect } from "react";
import instance from "../axios/axios";
import { useDispatch } from "react-redux";
import { setGetShopsByCity } from "../redux/slices/userSlice";

export const useGetShopByCity = (isLogging, role, city) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLogging || role !== "user" || !city) return;
    const fetchShop = async () => {
      try {
        const res = await instance.get(`/shop/get-by-city/${city}`);
        if (res.data.success) {
          dispatch(setGetShopsByCity(res?.data?.shops));
        }
      } catch (error) {
        console.log(error);
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchShop();
  }, [dispatch, isLogging, role, city]);
};
