import axios from "axios";

const BaseUrl = "http://localhost:8080";
export const instance = axios.create({
  baseURL: BaseUrl,
});
