import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Utils } from '@/lib/utils'

type TFeedingRequestBlockProps = {
  _id: string;
  dogGroupName: string,
  dogsList: string[],
  startDate: string,
  endDate?: string,
  message?: string,
  createdBy?: string,
  createdOn?: string,
  onAcceptFeedingRequest?: (feedingRequestId: string) => void,
  status?: 'ACCEPTED' | 'PENDING',
  acceptedBy?: string,
  acceptedOn?: string
}

const FeedingRequestBlock = ({
  _id,
  dogGroupName,
  dogsList,
  startDate,
  endDate,
  message,
  createdBy,
  createdOn,
  onAcceptFeedingRequest,
  status,
  acceptedBy,
  acceptedOn
}: TFeedingRequestBlockProps) => {

  return (
    <View className={`p-4 rounded-md border border-gray-300 relative ${status ? 'mb-2 mt-4' : 'mb-4'} `}>
      {status && <Text className={`absolute right-4 -top-3.5 text-sm py-1 px-2 border rounded-2xl ${status === 'ACCEPTED' ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`}>{status === 'ACCEPTED' ? 'Accepted' : 'Pending'}</Text>}
      <View className='flex flex-row flex-1 gap-4'>
        <View className='h-20 w-20 bg-gray-100 rounded-full flex justify-center items-center'>
          <Text className='text-3xl font-medium'>{Utils.getGroupNameAvatar(dogGroupName)}</Text>  
        </View>
        <View className='flex-1'>
          <Text className='font-bold mb-2 text-lg'>{dogGroupName}</Text>

          <Text className='text-xs'>Dogs to feed:</Text>
          <View className='flex flex-row flex-wrap'>
            {dogsList.map((dog, index) => <Text key={index} className='text-xs font-bold'>{ dog + `${dogsList.length === index + 1 ? "" : ", "}` }</Text>)}
          </View>
          
        </View>
      </View>
      <View className='flex flex-row mt-4 justify-center'>
        <Text className='text-blue-400 text-sm'>Dates: </Text>
        <Text className='text-blue-400 text-sm'>{startDate}</Text>
        {endDate && <Text className='text-blue-400 text-sm'> → {endDate}</Text>}
      </View>
      {message && (
        <View className='mt-2'>
          <Text className='text-sm'>Message: {message}</Text>
        </View>
      )}
      {!status && onAcceptFeedingRequest && (
        <TouchableOpacity onPress={() => onAcceptFeedingRequest(_id)}>
          <Text className="mt-5 bg-gray-100 p-2 border border-l-primary-200 rounded-lg text-center">Accept Feeding Request</Text>
        </TouchableOpacity>
      )}
      {!status && createdBy && createdOn && (
        <Text className='text-xs w-full text-right mt-2 text-gray-500'>Created By: {createdBy} on {createdOn}</Text>
      )}
      {status && acceptedBy && acceptedOn && (
        <Text className='text-xs w-full text-right mt-2 text-gray-500'>Accepted By: {acceptedBy} on {acceptedOn}</Text>
      )}
    </View>
  )
}

export default FeedingRequestBlock

const styles = StyleSheet.create({})