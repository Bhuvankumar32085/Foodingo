import { useEffect } from "react";
import instance from "../axios/axios";
import { useDispatch } from "react-redux";
import {
  setAddToCartAfterLogout,
  setIsLogging,
  setLoggedUser,
  setShop,
} from "../redux/slices/userSlice";

export const useGetCurrentUser = (isLogging) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!isLogging) return;
    const fetchUser = async () => {
      try {
        const res = await instance.get("/user/current-user");
        if (res.data.success) {
          dispatch(setLoggedUser(res.data.user));
          dispatch(setIsLogging(true));
        }
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
        dispatch(setLoggedUser(null));
        dispatch(setIsLogging(false));
        dispatch(dispatch(setShop(null)));
        dispatch(setAddToCartAfterLogout([]));
      }
    };

    fetchUser();
  }, [dispatch, isLogging]);
};
