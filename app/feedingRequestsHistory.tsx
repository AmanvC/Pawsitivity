import { Image, SafeAreaView, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import SideBySideTabs from '@/components/SideBySideTabs'
import AvailableFeedingRequests from '@/components/AvailableFeedingRequests'
import UserCreatedFeedingRequests from '@/components/UserCreatedFeedingRequests'
import UserAcceptedFeedingRequests from '@/components/UserAcceptedFeedingRequests'
import icons from '@/constants/icons'

const FeedingRequestsHistory = () => {
  const router = useRouter();

  const goBackToProfilePage = () => {
    router.push('/(root)/(tabs)/profile')
  }

  return (
    <SafeAreaView className="h-full px-5 bg-white">
      <TouchableOpacity onPress={goBackToProfilePage} className="mt-5 mb-4 text-2xl font-rubik-bold flex flex-row gap-2 items-center">
        <Image source={icons.backArrow} className="size-8" />
        <Text className='text-xl'>Feeding Request History</Text>
      </TouchableOpacity>
      <SideBySideTabs 
        tabs={[
          {label: 'Created', content: <UserCreatedFeedingRequests />},
          {label: 'Accepted', content: <UserAcceptedFeedingRequests />}
        ]}
      />
    </SafeAreaView>
  )
}

export default FeedingRequestsHistory;