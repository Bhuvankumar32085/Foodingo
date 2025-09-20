import { useEffect } from "react";
import instance from "../axios/axios";

export const useUpdateLocation = (isLogging) => {
  useEffect(() => {
    if (!isLogging) return;
    const fetchLocation = async (lat, lon) => {
      try {
        const res = await instance.post("/user/update-location", { lat, lon });
        if (res.data.success) {
          console.log('location updated');
        }
      } catch (error) {
        console.error(error);
      }
    };

    navigator.geolocation.watchPosition(async (position) => {
      fetchLocation(position.coords.latitude, position.coords.longitude);
    });
  }, [isLogging]);
};

// getCurrentPosition
// Ek baar turant current location nikalta hai.
// Jab tak tum manually dobara call nahi karoge, ye fir se nahi chalega.

// watchPosition
// Background me continuous tracking karta hai.
// Jaise hi user thoda bhi move karta hai aur device nayi location detect karta hai → callback trigger ho jata hai.
// Ye automatically bar-bar run hota hai bina manually dobara call kiye.
