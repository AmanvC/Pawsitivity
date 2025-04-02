import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons';
import Search from '@/components/Search';

const index = () => {

  const onJoinCommunity = () => {};

  const getGreetMessage = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Morning';
    if (hours >= 12 && hours < 16) return 'Afternoon';
    return 'Evening';
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-5 flex-1">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row">
            {/* TODO - AMAN Fix these */}
            {/* <Image source={{ uri: user?.avatar }} className="size-12 rounded-full" /> */}
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Good {getGreetMessage()}</Text>
              {/* <Text className="text-base font-rubik-medium text-black-300">{user?.name}</Text> */}
            </View>
          </View>
          <Image source={icons.bell} className="size-6" />
        </View>

        <View className="flex mt-10">
          <Text className="font-rubik-medium text-4xl text-blue-900 mb-8">Welcome to Pawsitivity</Text>
          <View className="flex flex-row justify-between items-center border-b pb-3 border-primary-200">
            <Text className="font-rubik-medium text-3xl text-black-300">Communities</Text>
            <TouchableOpacity onPress={onJoinCommunity}>
              <Text className="font-rubik-medium text-black-300 p-2 border rounded-lg">Join</Text>
            </TouchableOpacity>
          </View>
          
          <Search />

          <ScrollView className='mt-4' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 330 }}> 
            <View className="mt-2 flex flex-row flex-wrap gap-1.5">
              {Array(50).fill(null).map((_, index) => (
                <View key={index} className='flex flex-row p-2 rounded-md border border-primary-200 mb-2'>
                  <Text>Devashish City</Text>
                </View>
              ))}
            </View>
          </ScrollView>

        </View>
      </View>
    </SafeAreaView>
  );
}

export default index;