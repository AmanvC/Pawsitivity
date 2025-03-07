import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import images from '@/constants/images';
import icons from '@/constants/icons';

const SignIn = () => {

  const handleLogin = () => {

  }

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Image source={images.dog} className='w-full h-4/6' resizeMode='contain' />
        <View className='px-10'>
          <Text className='text-base text-center uppercase font-rubik text-black-200'>Welcome to Pawsitivity</Text>
          <Text className='text-3xl font-rubik text-black-300 text-center mt-2'>Let's get started!</Text>
          <Text className='text-lg font-rubik text-black-200 text-center mt-12'>Login to <Text className='text-primary-300'>Pawsitivity</Text> with Google</Text>
          <TouchableOpacity onPress={handleLogin} className='bg-white shadow-md shadow-zinc-800 rounded-full w-full py-4 mt-5'>
            <View className='flex flex-row items-center justify-center'>
              <Image source={icons.google} className='w-5 h-5' resizeMode='contain' />
              <Text className='text-lg font-rubik-medium text-black-300 ml-2 pt-2'>Continue with Google</Text>
            </View>
          </TouchableOpacity>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn;

const styles = StyleSheet.create({})