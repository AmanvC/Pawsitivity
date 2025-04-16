import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useApi } from '@/lib/useApi';
import { EApiEndpoints, EApiStatus, TRESPONSE_GetUserAcceptedFeedingRequests } from '@/lib/types';
import { showFailureToast } from '@/lib/toastHandler';
import Loader from './Loader';
import FeedingRequestBlock from './FeedingRequestBlock';
import { Utils } from '@/lib/utils';

const UserAcceptedFeedingRequests = () => {
  const [userAcceptedFeedingRequests, setUserAcceptedFeedingRequests] = useState<TRESPONSE_GetUserAcceptedFeedingRequests['data']>([]);

  const { callApi, responseData, error, loading } = useApi<TRESPONSE_GetUserAcceptedFeedingRequests>({ method: 'GET', url: EApiEndpoints.GetAllUserAcceptedFeedingRequests});

  useEffect(() => {
    getUserAcceptedFeedingRequests();
  }, []);

  const getUserAcceptedFeedingRequests = () => {
    callApi();
  }

  useEffect(() => {
    if(responseData) {
      if(responseData.status === EApiStatus.SUCCESS) {
        setUserAcceptedFeedingRequests(responseData.data);
      } else showFailureToast('Something went wrong!');
    }
  }, [responseData]);

  return (
    <SafeAreaView className='h-full w-full'>
      {(loading) && <Loader />}
      {userAcceptedFeedingRequests && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View>
              {userAcceptedFeedingRequests.map(request => (
                <FeedingRequestBlock
                  key={request._id}
                  _id={request._id}
                  dogGroupName={request.dogGroup.groupName}
                  dogsList={request.dogGroup.dogs.map(dog => dog.dogName)}
                  startDate={Utils.getFormattedDate(request.fromDate)}
                  endDate={Utils.getFormattedDate(request.toDate)}
                  message={request.message || ''}
                />
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default UserAcceptedFeedingRequests

const styles = StyleSheet.create({})