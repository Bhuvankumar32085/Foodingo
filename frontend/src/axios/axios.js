import axios from "axios";

const instance = axios.create({
  baseURL: "https://foodingo-g39f.onrender.com/api",
  withCredentials: true,
});

export default instance;
