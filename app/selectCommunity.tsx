import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthProvider';
import Dropdown from '@/components/Dropdown';
import { TFilterType } from '@/lib/types';
import images from '@/constants/images';
import { showFailureToast, showInfoToast } from '@/lib/toastHandler';
import { useRouter, useLocalSearchParams } from 'expo-router';

const SelectCommunity = () => {
  const { allowUserToChangeCommunity } = useLocalSearchParams();

  const { user, selectedCommunity, updateSelectedCommunity } = useAuth();
  const [communityFilterItems, setCommunityFilterItems] = useState<TFilterType[]>([]);
  const [userSelectedCommunityId, setUserSelectedCommunityId] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if(user) {
      setCommunityFilterItems(user.data.joinedCommunities.map(community => ({ label: community.communityName, value: community._id })));
    }
  }, [user]);

  useEffect(() => {
    if(communityFilterItems.length === 1) {
      // handleContinue();
    }
  }, [userSelectedCommunityId])

  const handleSelectCommunity = (formKey: string, selectedCommunityId: string) => {
    setUserSelectedCommunityId(selectedCommunityId);
  }

  const handleContinue = () => {
    if(!userSelectedCommunityId.length) {
      showInfoToast('Please select a community to continue!');
      return;
    }
    const selectedCommunity = user?.data.joinedCommunities.find(community => community._id === userSelectedCommunityId);
    console.log({UserSelectedThisCommunity: selectedCommunity})
    if(selectedCommunity) updateSelectedCommunity(selectedCommunity);
    else showFailureToast('Please contact developer!');
  }

  useEffect(() => {
    if(!allowUserToChangeCommunity && selectedCommunity) {
      router.replace("/(root)/(tabs)/home");
    }
  }, [selectedCommunity])

  return (
    <View className='h-full flex flex-col items-center justify-center p-10 gap-20'>
      <Image source={images.paws} className='h-40 aspect-square' resizeMode='contain' />
      <View>
        <Text className='font-rubik-light text-black-300 text-4xl text-center mb-10'>Select a community</Text>
        <Dropdown
          dropdownKey="community"
          allItems={communityFilterItems}
          onChange={handleSelectCommunity}
        />
      </View>
      <TouchableOpacity onPress={handleContinue} activeOpacity={0.8} className='w-full mt-20' >
        <Text className="text-lg font-rubik-medium bg-black-300 text-blue-100 p-3 border rounded-lg text-center">Continue</Text>
      </TouchableOpacity>
      {/* <View className='w-full h-1 border-t-2 border-black-100 opacity-45 my-20'></View> */}
      
    </View>
  )
}

export default SelectCommunity;