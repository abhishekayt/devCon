import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const api = axios.create({
  baseURL: BASE_URL ? BASE_URL : "http://localhost:8080/api/v1",
  withCredentials: true,
});
