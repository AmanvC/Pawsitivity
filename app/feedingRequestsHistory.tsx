import { Image, Platform, SafeAreaView, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import SideBySideTabs from '@/components/SideBySideTabs'
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
        <Image
          source={icons.backArrow} 
          style={Platform.select({
            web: { width: 32, height: 32 }, 
            android: { width: 32, height: 32 },
            ios: { width: 32, height: 32 },
          })}
        />
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