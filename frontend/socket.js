import { io } from "socket.io-client";

export const socket = io("https://foodingo-9rf7.onrender.com", {
  withCredentials: true,
  autoConnect: false, 
});
