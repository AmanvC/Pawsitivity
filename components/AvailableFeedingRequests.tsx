import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Utils } from '@/lib/utils'

const AvailableFeedingRequests = () => {
  return (
    <SafeAreaView className='h-full w-full'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View>
          {Array(10).fill(null).map((_, index) => (
            <FeedingRequestBlock
              key={index}
              dogGroupName='PG Hostel'
              dogsList={['Sheru', 'Leeche', 'Megan', 'Dubi', 'Lambu', 'Casperrrrrrrr']}
              startDate='2025-03-18'
              endDate='2025-03-19'
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type TFeedingRequestBlockProps = {
  dogGroupName: string,
  dogsList: string[],
  startDate: string,
  endDate?: string,
}

const FeedingRequestBlock = ({dogGroupName, dogsList, startDate, endDate}: TFeedingRequestBlockProps) => {

  return (
    <View style={styles.requestContainer} className='p-4 mb-4 rounded-md border border-gray-300'>
      <View className='flex flex-row flex-1 gap-4'>
        <View className='h-20 w-20 bg-gray-100 rounded-full flex justify-center items-center'>
          <Text className='text-3xl font-medium'>{Utils.getGroupNameAvatar(dogGroupName)}</Text>  
        </View>
        <View className='flex-1'>
          <Text className='font-bold mb-2 text-lg'>{dogGroupName}</Text>

          <Text className='text-xs'>Dogs to feed:</Text>
          <View className='flex flex-row flex-wrap'>
            {dogsList.map((dog, index) => <Text key={index} className='text-xs'>{ dog + `${dogsList.length === index + 1 ? "" : ", "}` }</Text>)}
          </View>
          
        </View>
      </View>
      <View className='flex flex-row mt-4 justify-center'>
        <Text className='text-blue-400 text-sm'>Dates: </Text>
        <Text className='text-blue-400 text-sm'>{startDate}</Text>
        {endDate && <Text className='text-blue-400 text-sm'> → {endDate}</Text>}
      </View>
      <TouchableOpacity>
        <Text className="mt-5 bg-gray-100 p-2 border border-l-primary-200 rounded-lg text-center">Accept Feeding Request</Text>
      </TouchableOpacity>
    </View>
  )
}

export default AvailableFeedingRequests

const styles = StyleSheet.create({
  requestContainer: {
    // boxShadow: "inset 0px 0px 20px 1px rgba(0, 0, 0, 0.1)"
  }
})