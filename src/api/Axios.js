import axios from "axios";
import config from "../config/config.json";

const { SERVER_IP, PRODUCTION, PORT } = config;

const localIpAddress = "http://" + window.location.hostname;

export const finalIpAddress =
  (PRODUCTION ? SERVER_IP : localIpAddress) + ":" + PORT;

export const axiosNT = axios.create({
  baseURL: finalIpAddress,
  timeout: 10000,
});
