import axios from "axios";

// axios.defaults.withCredentials = true
const instance = axios.create({
  baseURL: `http://140.112.106.203:8081/`,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response)
);

export default instance;
