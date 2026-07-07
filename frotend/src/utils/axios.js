import axios from "axios";

const instance = axios.create({
  withCredentials: true,
  timeout: 15000,
});

export default instance;
