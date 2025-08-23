import { useState } from 'react';
import axios from 'axios';
import { getKey } from './secureStore';
import { useAuth } from '@/context/AuthProvider';
import { Alert } from 'react-native';
import { ESecureStoreKeys } from './types';
import { showFailureToast } from './toastHandler';
import Constants from "expo-constants";

interface ApiParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any
}

export const useApi = <TData>({
  method,
  url,
}: Omit<ApiParams, 'data'>) => {
  const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  const [responseData, setResponseData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { logout } = useAuth();

  const callApi = async (data?: any) => {
    setLoading(true);
    setError(null);

    try {
      if (data instanceof FormData) {
        for (let pair of data.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }
      } else {
        console.log({ "API Payload": data });
      }

      const jwtToken = await getKey(ESecureStoreKeys.JWT_TOKEN);
      
      const response = await axios({
        method,
        url: baseUrl + url,
        data,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log({ response: response.data });
      setResponseData(response.data);
    } catch (err: any) {
      console.log({err})
      console.log("Error in API: ", err.response?.data.message || err.message);
      showFailureToast(err.response?.data.message || err.message || 'Something went wrong!');

      if (err.response?.status === 401) {
        console.warn("Token expired or unauthorized request!");
        logout();
        Alert.alert("Session Expired", "Please login again!");
        return;
      } else if (err.response?.status === 400) {
        console.log(err.response.data.message);
        return;
      } else {
        setError(err.response?.data.message || err.message);
      }

    } finally {
      setLoading(false);
    }
  };

  const callApiUsingFetch = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      if (data instanceof FormData) {
        for (let pair of data.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }
      } else {
        console.log({ "API Payload": data });
      }
      const jwtToken = await getKey(ESecureStoreKeys.JWT_TOKEN);

      const res = await fetch(`${baseUrl}dog/create`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'multipart/form-data'
        },
      })
      const result = await res.json();
      setResponseData(result);
    } catch (err: any) {
      console.log({err})
      console.log("Error in API: ", err.response?.data.message || err.message);
      showFailureToast(err.response?.data.message || err.message || 'Something went wrong!');

      if (err.response?.status === 401) {
        console.warn("Token expired or unauthorized request!");
        logout();
        Alert.alert("Session Expired", "Please login again!");
        return;
      } else if (err.response?.status === 400) {
        console.log(err.response.data.message);
        return;
      } else {
        setError(err.response?.data.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    responseData,
    error,
    loading,
    callApi,
    callApiUsingFetch
  };
};