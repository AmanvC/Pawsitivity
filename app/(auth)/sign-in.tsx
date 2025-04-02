import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Redirect } from 'expo-router';
import Textbox from '@/components/Textbox';
import { useApi } from '@/lib/useApi';

type TLoginFormData = {
  email: string;
  password: string;
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
    password: ""
  });

  const { callApi, error, loading, responseData } = useApi<TApiResponse>({method: 'POST', url: 'auth/login', data: formData});

  // const { refetch, isLoggedIn } = useGlobalContext();

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  // if(!loading && isLoggedIn) return <Redirect href="/" />

  const handleLogin = async () => {
    if(!formData.email || !formData.password) {
      Alert.alert('Warning', 'Please fill all the required fields!');
      return;
    }
    callApi();
  }

  const handleValueChange = (formKey: string, selectedValue: string) => {
    setFormData(prev => ({...formData, [formKey]: selectedValue}));
  }

  useEffect(() => {
    console.log("*********************** : ", responseData)
  }, [responseData])

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
          />
          <TouchableOpacity onPress={handleLogin} activeOpacity={0.8} >
            <Text className="text-lg font-rubik-medium bg-black-300 text-blue-100 p-3 border rounded-lg text-center">Login</Text>
          </TouchableOpacity>
          {error && <Text className='text-danger text-center'>*{error.message}</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;

const styles = StyleSheet.create({})