import axios from "axios";
import Cookies from "js-cookie";

const AxiosClient = axios.create({
  baseURL: "http://localhost:3002",
});

AxiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosClient;
