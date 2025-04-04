import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { getToken } from './secureStore';
import { useAuth } from '@/context/AuthProvider';
import { Alert } from 'react-native';

interface ApiParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any
}

export const useApi = <TData>({method, url, data}: ApiParams) => {
  // const baseUrl = process.env.BASE_URL + "/api/v1/"; TODO - AMAN Check why unable to get environment variable
  const baseUrl = "http://192.168.1.30:3000" + "/api/v1/";
  const [responseData, setResponseData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { logout } = useAuth();

  const callApi = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log({"API URL": baseUrl + url})
      console.log({"API Payload": data})
      const response = await axios({
        method,
        url: baseUrl + url,
        data,
        headers: {
          Authorization: `Bearer ${await getToken("jwtToken")}`,
        },
      });
      console.log({response: response.data})
        
      setResponseData(response.data);
    } catch (err: any) {
      console.log("Error in API: ", err.response?.data || err.message);

      // Token expired case
      if (err.response?.status === 401) {
        console.warn("Token expired or unauthorized request!");
        logout();
        Alert.alert("Session Expired", "Please login again!");
      } else {
        setError(err.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    responseData,
    error,
    loading,
    callApi,
  };
};