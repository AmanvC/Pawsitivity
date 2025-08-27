import { Image, Platform, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons';
import { useAuth } from '@/context/AuthProvider';
import { Utils } from '@/lib/utils';
import images from '@/constants/images';
import { useRootNavigationState, useRouter } from 'expo-router';

const index = () => {

  const { user, selectedCommunity, tokenLoaded } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const getGreetMessage = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'Morning';
    if (hours >= 12 && hours < 16) return 'Afternoon';
    return 'Evening';
  };

  useEffect(() => {
    // Wait until router is mounted
    if (!rootNavigationState?.key) return;

    if (!selectedCommunity) {
      router.replace("/selectCommunity");
    }
  }, [selectedCommunity, rootNavigationState]);

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="px-5 h-[calc(100%-70px)] flex">
        <View className="flex flex-row items-center justify-between mt-5">
          <View className="flex flex-row">
            <View className='size-12 bg-black-300 flex justify-center items-center rounded-full'>
              <Text className={`text-white font-rubik-bold ${Platform.select({web: "text-xl"})}`}>{Utils.getGroupNameAvatar(user?.data.name || '')}</Text>
            </View>
            <View className="flex flex-col items-start ml-2 justify-center">
              <Text className="text-xs font-rubik text-black-100">Good {getGreetMessage()}</Text>
              <Text className="text-base font-rubik-medium text-black-300">{user?.data.name}</Text>
            </View>
          </View>
          <Image
            source={icons.bell}
            style={Platform.select({
              web: { width: 24, height: 24 }, 
              android: { width: 24, height: 24 },
              ios: { width: 24, height: 24 },
            })}
          />
        </View>

        <View className={`mt-4 ${Platform.select({web: "flex-1 overflow-scroll"})}`}>
          {/* <Text className={`font-rubik-medium text-4xl text-blue-900 text-center ${Platform.select({web: "text-[30px]"})}`}>Welcome to Pawsitivity</Text> */}
          <Image
            source={images.dogHi}
            resizeMode="contain"
            className="w-full h-[83%]"
            style={Platform.OS === "web" ? { width: "100%", height: "80%" } : {}}
          />

          <View className='w-full flex flex-row justify-center items-center relative bottom-4'>
            <Text className={`text-2xl font-rubik-medium text-blue-900 ${Platform.select({web: "text-[16px]"})}`}>Pause for Paws </Text>
            <Image
              source={images.paws}
              resizeMode="contain"
              className="h-10 w-10"
              style={Platform.OS === "web" ? { height: 30, width: 30 } : {}}
            />
          </View>

          {/* <View className="flex flex-row justify-between items-center border-b pb-3 border-primary-200">
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
          </ScrollView> */}

        </View>
      </View>
    </SafeAreaView>
  );
}

export default index;