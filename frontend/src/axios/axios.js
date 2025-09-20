import axios from "axios";

const instance = axios.create({
  baseURL: "https://foodingo-9rf7.onrender.com/api",
  withCredentials: true,
});

export default instance;
