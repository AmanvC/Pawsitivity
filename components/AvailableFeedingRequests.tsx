import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Utils } from '@/lib/utils'
import { useApi } from '@/lib/useApi';
import { EApiEndpoints, EApiStatus, TApiGenericResponse, TREQUEST_AcceptFeedingRequest, TREQUEST_GetPendingFeedingRequests, TRESPONSE_GetPendingFeedingRequests } from '@/lib/types';
import { useAuth } from '@/context/AuthProvider';
import Loader from './Loader';
import { useFocusEffect } from 'expo-router';
import { showFailureToast, showSuccessToast } from '@/lib/toastHandler';
import FeedingRequestBlock from './FeedingRequestBlock';

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

export default AvailableFeedingRequests