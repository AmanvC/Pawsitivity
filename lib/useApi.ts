import { useState } from 'react';
import axios from 'axios';
import { getKey } from './secureStore';
import { useAuth } from '@/context/AuthProvider';
import { Alert } from 'react-native';
import { ESecureStoreKeys } from './types';
import { showFailureToast } from './toastHandler';

interface ApiParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any
}

export const useApi = <TData>({method, url, data}: ApiParams) => {
  const baseUrl = "http://192.168.1.32:3000" + "/api/v1/";
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
      const jwtToken = await getKey(ESecureStoreKeys.JWT_TOKEN);
      const response = await axios({
        method,
        url: baseUrl + url,
        data,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log({response: response.data})
        
      setResponseData(response.data);
    } catch (err: any) {
      console.log("Error in API: ", err.response?.data.message || err.message);
      showFailureToast(err.response?.data.message || err.message || 'Something went wrong!');

      // Token expired case
      if (err.response?.status === 401) {
        console.warn("Token expired or unauthorized request!");
        logout();
        Alert.alert("Session Expired", "Please login again!");
        return;
      } else if(err.response.status === 400) {
        console.log(err.response.data.message);
        logout();
        return;
      }
      else {
        setError(err.response?.data.message || err.message);
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