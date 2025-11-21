import axios, { AxiosInstance, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.SERVER_URL || process.env.NEXT_PUBlIC_SERVER_URL || process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://idolomerchserver.vercel.app"}/api/v1`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse<Response>) => response,
  (error) => {
    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.detail ||
      error.message ||
      "Something went wrong";

    if (error.code === "ERR_NETWORK") {
      message = "Unable to connect to server. Please check your internet.";
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
