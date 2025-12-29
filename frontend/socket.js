import { io } from "socket.io-client"; 

export const socket = io("https://foodingo-g39f.onrender.com", {
  withCredentials: true,
  autoConnect: false, 
});
