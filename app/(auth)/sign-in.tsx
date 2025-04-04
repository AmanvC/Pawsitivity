import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import images from '@/constants/images';
import { useRouter } from 'expo-router';
import Textbox from '@/components/Textbox';
import { useApi } from '@/lib/useApi';
import { useAuth } from '@/context/AuthProvider';
import { getOrCreateDeviceId } from '@/lib/secureStore';
import { showFailureToast, showInfoToast, showSuccessToast } from '@/lib/toastHandler';

type TLoginFormData = {
  email: string;
  password: string;
  device: string | null;
}

type TApiResponse = {
  status: 'SUCCESS' | 'FAILURE';
  message: string;
  token?: string;
  options?: {
    continueHere: boolean;
    logoutPrevious: boolean
  }
}

const SignIn = () => {
  const [formData, setFormData] = useState<TLoginFormData>({
    email: "",
    password: "",
    device: ""
  });
  const router = useRouter();

  const { callApi, error, loading, responseData } = useApi<TApiResponse>({method: 'POST', url: 'auth/login', data: formData});
  const { callApi: forceLogin, error: forceError, responseData: forcedLoginData } = useApi<TApiResponse>({method: 'POST', url: 'auth/force-login', data: formData})

  const { login, user } = useAuth();

  const handleLogin = async () => {
    console.log({formData})
    if (!formData.device) {
      showFailureToast('Something went wrong!', 'Please contact the developer!')
      return;
    }
    if(!formData.email || !formData.password) {
      showInfoToast('Warning', 'Please fill all the required fields!');
      return;
    }
    callApi();
  }

  const handleValueChange = (formKey: string, selectedValue: string) => {
    setFormData(prev => ({...formData, [formKey]: selectedValue}));
  }

  useEffect(() => {
    if(responseData) {
      console.log({responseData})
      if(responseData.token) {
        console.log("LoggedIn Successfully!");
        login(responseData.token);
        router.push("/(root)/(tabs)");
      } else if (responseData.options) {
        forceLogin();
      }
    }
  }, [responseData])

  useEffect(() => {
    if(error) showFailureToast('Something went wrong!', error);
  }, [error])

  useEffect(() => {
    if(forcedLoginData) {
      console.log({forcedLoginData})
      if(forcedLoginData.token) {
        // Alert.alert('Multiple device logins!', 'You have been logged out from the previous logged in device.');
        showSuccessToast('Multiple device logins!', 'Logged out from previous device.');
        login(forcedLoginData.token);
        router.push("/(root)/(tabs)");
      }
    }
  }, [forcedLoginData]);

  useEffect(() => {
    if(forceError) showFailureToast('Something went wrong!', forceError);
  }, [forceError])

  useEffect(() => {
    const updateDeviceId = async () => {
      const device = await getOrCreateDeviceId();
      setFormData(prev => ({ ...prev, device }))
    }
    updateDeviceId();
  }, []);

  useEffect(() => {
    console.log("AuthContext user updated:", user);
  }, [user]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <SafeAreaView className='bg-white h-full w-full'>
      <ScrollView contentContainerClassName='h-full px-2 flex flex-col'>
        <Image source={images.dog} className='w-full  rounded-xl' resizeMode='contain' />
        <View className='px-10 -mt-10'>
          <Text className='text-2xl text-center uppercase font-rubik text-black-200'>Welcome to Pawsitivity</Text>
        </View>
        <View className='mt-5 px-5 flex gap-4'>
          <Textbox
            formKey='email'
            title='Email'
            maxLength={100}
            value={formData.email}
            onChange={handleValueChange}
            isRequired={true}
            placeholder='abc@d.com'
            clearValue={false}
          />
          <Textbox
            formKey='password'
            title='Password'
            maxLength={100}
            value={formData.password}
            isHidden={true}
            onChange={handleValueChange}
            isRequired={true}
            placeholder='*****'
            clearValue={false}
          />
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} >
            <Text className="text-lg font-rubik-medium bg-black-300 text-blue-100 p-3 border rounded-lg text-center">Login</Text>
          </TouchableOpacity>
          {error && <Text className='text-danger text-center'>*{error}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;