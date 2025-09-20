import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCity } from "../redux/slices/userSlice";
import axios from "axios";
import { setLocation } from "../redux/slices/mapSlice";


export const useGetCity = () => {
  const dispatch = useDispatch();
  

  useEffect(() => {
    const fetchCity = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const res = await axios.get(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json&apiKey=d203d07c6c4c4ab6be4b2c096cd1d6a2`
            );

            dispatch(
              setLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              })
            );

            const place = res.data.results[0];
            const cityName =
              place.city ||
              place.town ||
              place.village ||
              place.suburb ||
              place.county ||
              place.state;

            if (cityName) {
              dispatch(setCity(cityName));
            }
          },
          (err) => {
            console.error("Location error:", err.message);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    };

    fetchCity();
  }, [dispatch]);
};
