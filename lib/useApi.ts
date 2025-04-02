import { useState } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any
}

export const useApi = <TData>({method, url, data}: ApiParams) => {
  // const baseUrl = process.env.BASE_URL + "/api/v1/"; TODO - AMAN Check why unable to get environment variable
  const baseUrl = "http://192.168.1.30:3000" + "/api/v1/";
  const [responseData, setResponseData] = useState<TData | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      });
      console.log({response: response.data})
        
      setResponseData(response.data);
    } catch (err: any) {
      console.log("Error in API: ", err.response?.data || err.message);
      setError(err.response.data);
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