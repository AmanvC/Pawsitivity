import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Utils } from '@/lib/utils'
import { useApi } from '@/lib/useApi';
import { EApiEndpoints, EApiStatus, TApiGenericResponse, TREQUEST_AcceptFeedingRequest, TREQUEST_GetPendingFeedingRequests, TRESPONSE_GetPendingFeedingRequests } from '@/lib/types';
import { useAuth } from '@/context/AuthProvider';
import Loader from './Loader';
import { useFocusEffect } from 'expo-router';
import { showFailureToast, showSuccessToast } from '@/lib/toastHandler';

const AvailableFeedingRequests = () => {
  const [pendingFeedingRequests, setPendingFeedingRequests] = useState<TRESPONSE_GetPendingFeedingRequests['data']>([]);
  const { selectedCommunity } = useAuth();

  const { callApi: getFeedingRequests, responseData: feedingRequestsResponse, error: feedingRequestError, loading: feedingRequestLoading } = useApi<TRESPONSE_GetPendingFeedingRequests>({ method: 'POST', url: EApiEndpoints.GetAllPendingFeedingRequests});

  const { callApi: acceptFeedingRequest, responseData: acceptFeedingRequestResponse, error: acceptFeedingRequestError, loading: acceptFeedingRequestLoading } = useApi<TApiGenericResponse>({ method: 'PATCH', url: EApiEndpoints.AcceptFeedingRequest});

  useEffect(() => {
    fetchFeedingRequests();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPendingFeedingRequests([]);
      fetchFeedingRequests();
    }, [])
  );

  const fetchFeedingRequests = () => {
    if(!selectedCommunity) {
      return;
    }
    getFeedingRequests({ communityId: selectedCommunity._id } as TREQUEST_GetPendingFeedingRequests);
  }

  useEffect(() => {
    if(feedingRequestsResponse) {
      if(feedingRequestsResponse.status === EApiStatus.SUCCESS) setPendingFeedingRequests(feedingRequestsResponse.data);
      else showFailureToast('Something went wrong!')
    }
  }, [feedingRequestsResponse]);

  const handleAcceptFeedingRequest = (feedingRequestId: string) => {
    acceptFeedingRequest({ feedingRequestId } as TREQUEST_AcceptFeedingRequest);
  }

  useEffect(() => {
    if(acceptFeedingRequestResponse) {
      if(acceptFeedingRequestResponse.status === EApiStatus.SUCCESS) {
        showSuccessToast(acceptFeedingRequestResponse.message);
        fetchFeedingRequests();
      } else showFailureToast(acceptFeedingRequestResponse.message);
    }
  }, [acceptFeedingRequestResponse]);

  if(!selectedCommunity) {
    return (
      <Text>You haven't joined any community yet! Please contact admin at : <Text className='font-bold'>amanvarshney.varshney@gmail.com</Text></Text>
    )
  }

  return (
    <SafeAreaView className='h-full w-full'>
      {(feedingRequestLoading || acceptFeedingRequestLoading) && <Loader />}
      {pendingFeedingRequests && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View>
              {pendingFeedingRequests.map(request => (
                <FeedingRequestBlock
                  key={request._id}
                  _id={request._id}
                  dogGroupName={request.dogGroup.groupName}
                  dogsList={request.dogGroup.dogs.map(dog => dog.dogName)}
                  startDate={Utils.getFormattedDate(request.fromDate)}
                  endDate={Utils.getFormattedDate(request.toDate)}
                  message={request.message || ''}
                  createdBy={request.createdBy.name}
                  createdOn={Utils.getFormattedDate(request.createdAt)}
                  onAcceptFeedingRequest={handleAcceptFeedingRequest}
                />
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

type TFeedingRequestBlockProps = {
  _id: string;
  dogGroupName: string,
  dogsList: string[],
  startDate: string,
  endDate?: string,
  message?: string,
  createdBy: string,
  createdOn: string
  onAcceptFeedingRequest: (feedingRequestId: string) => void
}

const FeedingRequestBlock = ({_id, dogGroupName, dogsList, startDate, endDate, message, createdBy, createdOn, onAcceptFeedingRequest}: TFeedingRequestBlockProps) => {

  return (
    <View className='p-4 mb-4 rounded-md border border-gray-300'>
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
      <TouchableOpacity onPress={() => onAcceptFeedingRequest(_id)}>
        <Text className="mt-5 bg-gray-100 p-2 border border-l-primary-200 rounded-lg text-center">Accept Feeding Request</Text>
      </TouchableOpacity>
      <Text className='text-xs w-full text-right mt-2 text-gray-500'>Created By: {createdBy} on {createdOn}</Text>
    </View>
  )
}

export default AvailableFeedingRequests