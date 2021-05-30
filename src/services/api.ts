import axios from 'axios'
import { Auth } from 'aws-amplify';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_DB_HOST,
    headers: {
    },
});

const getToken = async (): Promise<string> => {
    const p = performance.now();
    const userTokens = await Auth.currentSession()
    const token = userTokens.getIdToken().getJwtToken();
    console.log('p', performance.now()-p)
    return token;
}

axiosInstance.interceptors.request.use(async (config)=> {
    const token = await getToken();
    config.headers['Authorization'] = `Basic ${token}`;
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

export default axiosInstance;