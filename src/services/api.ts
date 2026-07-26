import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_DB_HOST,
  headers: {},
});

const getToken = async (): Promise<string | undefined> => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    return token;
  } catch (e) {
    return undefined;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (config.headers) {
      config.headers['Authorization'] = `Basic ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;