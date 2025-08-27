import { FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Dropdown from './Dropdown'
import DateRangePicker from './DateRangePicker'
import { useFocusEffect } from 'expo-router'
import { useAuth } from '@/context/AuthProvider'
import { useApi } from '@/lib/useApi'
import { EApiEndpoints, TApiGenericResponse, TFilterType, TREQUEST_CreateFeedingRequest, TREQUEST_GetAllCommunityDogGroupsAndDogInfo, TRESPONSE_GetAllCommunityDogGroupsAndDogInfo } from '@/lib/types'
import { showInfoToast, showSuccessToast } from '@/lib/toastHandler'
import Loader from './Loader'

type TFormData = {
  communityId: string | null,
  dogGroupId: string | null,
  fromDate: string | null,
  toDate: string | null,
  message?: string | null
}

const defaultValues: TFormData = {
  communityId: null,
  dogGroupId: null,
  fromDate: null,
  toDate: null,
  message: null
}

const CreateFeedingRequest = () => {
  const requiredFields: (keyof TFormData)[] = ['communityId', 'dogGroupId', 'fromDate'];

  const [formData, setFormData] = useState<TFormData>(defaultValues);
  const [communityFilterItems, setCommunityFilterItems] = useState<TFilterType[]>([]);
  const [dogGroupFilterItems, setDogGroupFilterItems] = useState<TFilterType[]>([]);
  const [dogsList, setDogsList] = useState<string[]>([]);

  const { selectedCommunity } = useAuth();

  const { callApi: getDogGroupsInfo, responseData: dogGroupsInfoRes, error: dogGroupInfoError, loading: dogGroupsLoading } = useApi<TRESPONSE_GetAllCommunityDogGroupsAndDogInfo>({ method: 'POST', url: EApiEndpoints.GetDogGroupsInfoInACommunity});

  const { callApi: createFeedingRequest, responseData: createFeedingRequestResponse, error: createFeedingRequestError, loading: createFeedingRequestLoading } = useApi<TApiGenericResponse>({ method: 'POST', url: EApiEndpoints.CreateFeedingRequest })

  const getAllInfo = () => {
    getDogGroupsInfo({ communityId: selectedCommunity?._id } as TREQUEST_GetAllCommunityDogGroupsAndDogInfo );
  };

  useEffect(() => {
    if(dogGroupsInfoRes && dogGroupsInfoRes.data) {
      setCommunityFilterItems(dogGroupsInfoRes.data.map(community => ({ label: community.communityName, value: community._id })));
    }
  }, [dogGroupsInfoRes]);

  useEffect(() => {
    if (!formData.communityId || !dogGroupsInfoRes?.data) return;
    const selectedCommunity = dogGroupsInfoRes.data.find(data => data._id === formData.communityId);
    if (selectedCommunity) {
      setDogGroupFilterItems(selectedCommunity.dogGroups.map(group => ({
        label: group.groupName,
        value: group._id
      })));
    }
  }, [formData.communityId, dogGroupsInfoRes]);

  useEffect(() => {
    if(!dogGroupsInfoRes?.data || !formData.communityId || !formData.dogGroupId) {
      setDogsList([]);
      return;
    }
    const selectedCommunity = dogGroupsInfoRes.data.find(data => data._id === formData.communityId);
    const selectedDogGroup = selectedCommunity?.dogGroups.find(dogGroup => dogGroup._id === formData.dogGroupId);
    const dogsList = selectedDogGroup?.dogs.map(dog => dog.dogName);
    setDogsList(dogsList || []);
  }, [dogGroupsInfoRes, formData.communityId, formData.dogGroupId])

  const handleDropdownChange = (dropdownKey: string, selectedValue: string) => {
    setFormData(prev => ({...prev, [dropdownKey]: selectedValue}));
  }

  const onDateChange = (fromDate: string | null, toDate: string | null) => {
    setFormData(prev => ({...prev, fromDate, toDate}));
  }

  const onSubmitForm = () => {
    let isValid = true;
    requiredFields.forEach(field => {
      if(!formData[field]) {
        isValid = false;
      }
    });
    if(!isValid) {
      showInfoToast('Please fill all the required fields!');
      return;
    }
    const { communityId, dogGroupId, fromDate, toDate, message } = formData;
    const payload: TREQUEST_CreateFeedingRequest = {
      communityId: communityId!,
      dogGroupId: dogGroupId!,
      fromDate: fromDate!,
      toDate,
      message
    }
    createFeedingRequest(payload);
  }

  useEffect(() => {
    if(createFeedingRequestResponse) {
      if(createFeedingRequestResponse.status === 'SUCCESS') {
        showSuccessToast(createFeedingRequestResponse.message);
        setFormData(defaultValues);
      }
    }
  }, [createFeedingRequestResponse])

  useFocusEffect(
    useCallback(() => {
      getAllInfo();
      setFormData(defaultValues);
    }, [])
  );

  if(!selectedCommunity) {
    return (
      <Text>You haven't joined any community yet! Please contact admin at : <Text className='font-bold'>amanvarshney.varshney@gmail.com</Text></Text>
    )
  }

  return (
    <SafeAreaView className={`${Platform.select({web: "h-full w-full overflow-scroll"})}`}>
      {(dogGroupsLoading || createFeedingRequestLoading) && <Loader />}
      <View className="flex gap-5" style={Platform.select({web: {paddingBottom: 120}})}>
        <FlatList
          data={[]} // No actual list items
          renderItem={null as any}
          keyExtractor={() => 'form'} // Prevent key warning
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 0 : 130 }}
          ListHeaderComponent={
            <View className="flex gap-5">
              <Dropdown
                dropdownKey="communityId"
                dropdownTitle="Select Community"
                allItems={communityFilterItems} 
                onChange={handleDropdownChange}
                isDisabled={false}
                isRequired={requiredFields.indexOf('communityId') !== -1}
              />
              <Dropdown
                dropdownKey="dogGroupId"
                dropdownTitle="Select dog group"
                allItems={dogGroupFilterItems} 
                onChange={handleDropdownChange}
                isDisabled={!formData.communityId}
                isRequired={requiredFields.indexOf('dogGroupId') !== -1}
              />
              {formData.dogGroupId && (
                <View className='flex flex-row flex-wrap relative -top-3'>
                  <Text className='text-sm'>Requesting for: </Text>
                  {dogsList.map((dog, index) => (
                    <Text key={index} className='font-medium text-sm'>{dog}{dogsList.length === index + 1 ? "" : ", "}</Text>
                  ))}
                </View>
              )}

              <DateRangePicker onDateChange={onDateChange} isRequired={true} range={{startDate: formData.fromDate, endDate: formData.toDate}} />

              <View className="mt-5">
                <Text>Message (Optional)</Text>
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={100}
                  onChangeText={text => handleDropdownChange('message', text)}
                  value={formData.message || ''}
                  className="p-3 border rounded-xl mt-2 border-primary-200 h-24 align-top"
                />
              </View>

              <TouchableOpacity onPress={onSubmitForm} activeOpacity={0.8}>
                <Text className="mt-5 text-lg font-rubik-medium bg-black-300 text-blue-100 p-3 border rounded-lg text-center">Create Request</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  )
}

export default CreateFeedingRequest;