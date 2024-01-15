import axios from "axios";
import config from "../config/config.json";

const { DOMEN, PRODUCTION, PORT } = config;

const localIpAddress = "http://" + window.location.hostname;

export const finalIpAddress =
  (PRODUCTION ? DOMEN : localIpAddress) + ":" + PORT;

export const axiosNT = axios.create({
  baseURL: finalIpAddress,
  timeout: 60000,
});
