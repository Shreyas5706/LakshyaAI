import axios from "axios";
import { getCookie } from "../utils/cookies";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api", // backend URL
});

// Add request interceptor to attach JWT
API.interceptors.request.use(
  (config) => {
    const session = getCookie("lakshyaSession");
    if (session && session.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;