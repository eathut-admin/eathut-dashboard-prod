import axios from "axios";
import { cookies } from "next/headers";

const apiClient = axios.create({
  baseURL: "https://eathut-server.onrender.com/api/v1",
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
