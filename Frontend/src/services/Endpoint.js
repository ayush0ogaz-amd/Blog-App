import axios from "axios";

// Set VITE_API_URL in Frontend/.env for deployments. This project runs its backend on port 5000.
export const BaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const API = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});

export const get = (url, config) => API.get(url, config);
export const post = (url, data, config) => API.post(url, data, config);
export const put = (url, data, config) => API.put(url, data, config);
export const patch = (url, data, config) => API.patch(url, data, config);
export const del = (url, config) => API.delete(url, config);

export const imageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${BaseUrl}/${image.replace(/^\/?public\//, "")}`;
};
