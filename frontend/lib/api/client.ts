import axios, { AxiosError } from 'axios';
import { getToken } from '../auth/token';

const BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:8080/api/';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers:{
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token =getToken();

    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error : AxiosError<{message: string}>) => {
    const message = 
    error.response?.data?.message ??
    error.message ??
    'Api request failed';

    return Promise.reject(new Error(message));
  }
);
    

