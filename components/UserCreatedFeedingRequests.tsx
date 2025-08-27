import { ScrollView, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { EApiEndpoints, EApiStatus, TRESPONSE_GetUserCreatedFeedingRequests } from '@/lib/types';
import { useApi } from '@/lib/useApi';
import { showFailureToast } from '@/lib/toastHandler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from './Loader';
import FeedingRequestBlock from './FeedingRequestBlock';
import { Utils } from '@/lib/utils';

const UserCreatedFeedingRequests = () => {
  const [userCreatedFeedingRequests, setUserCreatedFeedingRequests] = useState<TRESPONSE_GetUserCreatedFeedingRequests['data']>([]);

  const { callApi, responseData, error, loading } = useApi<TRESPONSE_GetUserCreatedFeedingRequests>({ method: 'GET', url: EApiEndpoints.GetAllUserCreatedFeedingRequests});

  useEffect(() => {
    getUserCreatedFeedingRequests();
  }, []);

  const getUserCreatedFeedingRequests = () => {
    callApi();
  }

  useEffect(() => {
    if(responseData) {
      if(responseData.status === EApiStatus.SUCCESS) {
        setUserCreatedFeedingRequests(responseData.data);
      } else showFailureToast('Something went wrong!');
    }
  }, [responseData]);


  return (
    <SafeAreaView className='h-full w-full'>
      {(loading) && <Loader />}
      {userCreatedFeedingRequests && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
          <View>
              {userCreatedFeedingRequests.map(request => (
                <FeedingRequestBlock
                  key={request._id}
                  _id={request._id}
                  dogGroupName={request.dogGroup.groupName}
                  dogsList={request.dogGroup.dogs.map(dog => dog.dogName)}
                  startDate={Utils.getFormattedDate(request.fromDate)}
                  endDate={Utils.getFormattedDate(request.toDate)}
                  message={request.message || ''}
                  status={request.requestStatus.status}
                  acceptedBy={request.requestStatus.acceptedBy ? request.requestStatus.acceptedBy.name : ''}                  
                  acceptedOn={request.requestStatus.acceptedOn ? Utils.getFormattedDate(request.requestStatus.acceptedOn) : ''}
                />
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default UserCreatedFeedingRequests;