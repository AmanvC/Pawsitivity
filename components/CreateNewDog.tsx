import { FlatList, Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ImageUploader from './ImageUploader'
import Dropdown from './Dropdown'
import Textbox from './Textbox'
import { useFocusEffect } from 'expo-router'
import Checkbox from './Checkbox'
import icons from '@/constants/icons'
import { showFailureToast, showInfoToast, showSuccessToast } from '@/lib/toastHandler'
import { useApi } from '@/lib/useApi'
import {
  EApiEndpoints,
  TApiGenericResponse,
  TFilterType,
  TREQUEST_GetAllCommunityDogGroupsAndDogInfo,
  TRESPONSE_GetAllCommunityDogGroupsAndDogInfo
} from '@/lib/types'
import { useAuth } from '@/context/AuthProvider'
import Loader from './Loader'
import { Utils } from '@/lib/utils'

type TFormData = {
  community: string | null,
  group: string | null,
  dogName: string | null,
  dob: string | null,
  vaccinationStatus: boolean,
  abcStatus: boolean,
  image: {
    uri: string;
    type: string;
    name: string;
  } | null,
  vaccinationDetails: TVaccinationDetailsFormData[]
}

const defaultValues: TFormData = {
  community: null,
  group: null,
  dogName: null,
  dob: null,
  vaccinationStatus: false,
  abcStatus: false,
  image: null,
  vaccinationDetails: []
}

const requiredFields: (keyof TFormData)[] = ['community', 'group', 'dogName', 'vaccinationStatus', 'abcStatus', 'image'];

const CreateNewDog = () => {

  const FormData = global.FormData;

  const [formData, setFormData] = useState<TFormData>(defaultValues);
  const [communityFilterItems, setCommunityFilterItems] = useState<TFilterType[]>([]);
  const [dogGroupFilterItems, setDogGroupFilterItems] = useState<TFilterType[]>([]);

  const { selectedCommunity, user } = useAuth();

  const { callApi: getDogGroupsInfo, responseData: dogGroupsInfoRes, error: dogGroupInfoError, loading: dogGroupsLoading } = useApi<TRESPONSE_GetAllCommunityDogGroupsAndDogInfo>({ method: 'POST', url: EApiEndpoints.GetDogGroupsInfoInACommunity});

  const { responseData: createDogResponse, error: createDogError, loading: createDogLoading, callApiUsingFetch } = useApi<TApiGenericResponse>({ method: 'POST', url: EApiEndpoints.CreateDog })

  const getAllInfo = () => {
    getDogGroupsInfo({ communityId: selectedCommunity?._id } as TREQUEST_GetAllCommunityDogGroupsAndDogInfo );
  }

  useEffect(() => {
    if(dogGroupsInfoRes && dogGroupsInfoRes.data) {
      setCommunityFilterItems(dogGroupsInfoRes.data.map(community => ({ label: community.communityName, value: community._id })));
    }
  }, [dogGroupsInfoRes])

  const handleValueChange = (formKey: string, selectedValue: TFormData[keyof TFormData]) => {
    setFormData(prev => ({...prev, [formKey]: selectedValue}));
  }

  useEffect(() => {
    if (!formData.community || !dogGroupsInfoRes?.data) return;
    const selectedCommunity = dogGroupsInfoRes.data.find(data => data._id === formData.community);
    if (selectedCommunity) {
      setDogGroupFilterItems(selectedCommunity.dogGroups.map(group => ({
        label: group.groupName,
        value: group._id
      })));
    }
  }, [formData.community, dogGroupsInfoRes]);

  const onSubmitForm = async () => {
    let isValid = true;
  
    requiredFields.forEach(field => {
      if (formData[field] == null) {
        isValid = false;
      }
    });
  
    formData.vaccinationDetails.forEach(detail => {
      if (!detail.vaccinationName) isValid = false;
    });
    if (!isValid) {
      showInfoToast('Please fill all the required fields!');
      return;
    }
    let formattedDate: Date | null = null;
    if(formData.dob) {
      const isValid = Utils.checkCorrectDateFormat(formData.dob);
      if(!isValid) {
        showInfoToast("Invalid Date. Please enter in the given format!");
        return;
      }
      const [day, month, year] = formData.dob.split('-');
      formattedDate = new Date(Number(year), Number(month) - 1, Number(day))
    }
    const apiFormData = new FormData();
    apiFormData.append("communityId", formData.community as string);
    apiFormData.append("dogGroupId", formData.group as string);
    apiFormData.append("dogName", formData.dogName as string);
    apiFormData.append("dob", formattedDate ? String(formattedDate) : "");
    apiFormData.append("abcStatus", String(formData.abcStatus));
    apiFormData.append("vaccinationStatus", String(formData.vaccinationStatus));
    apiFormData.append("vaccinationDetails", JSON.stringify(formData.vaccinationDetails));
  
    if (formData.image) {
      const imageData = {
        uri: formData.image.uri,
        name: formData.image.name || `photo_${Date.now()}.jpg`,
        type: 'image/png',
      };
  
      apiFormData.append("image", imageData as any);
    }
    callApiUsingFetch(apiFormData);
  };
  

  useEffect(() => {
    if(createDogResponse) {
      if(createDogResponse.status === 'SUCCESS') {
        showSuccessToast(createDogResponse.message);
        setFormData(defaultValues);
      }
    }
  }, [createDogResponse]);

  useEffect(() => {
    if(createDogError) {
      showFailureToast(createDogError);
    }
  }, [createDogError])

  const handleAddVaccinationDetailsBlock = () => {
    setFormData(prev => {
      return {
        ...prev,
        vaccinationDetails: [
          ...prev.vaccinationDetails,
          {
            vaccinationName: null,
            veterinaryName: null,
            vaccinationDate: null
          }
        ]
      }
    })
  }

  const handleDeleteVaccinationDetailsBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      vaccinationDetails: prev.vaccinationDetails.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateVaccinationDetails = (updatedData: TVaccinationDetailsFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      vaccinationDetails: prev.vaccinationDetails.map((data, i) => i === index ? updatedData : data)
    }));
  }

  useEffect(() => {
    if(formData.vaccinationDetails.length) setFormData({ ...formData, vaccinationStatus: true });
    else setFormData({ ...formData, vaccinationStatus: false });
  }, [formData.vaccinationDetails])

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
    <SafeAreaView className={Platform.select({web: 'flex-1 w-full overflow-scroll pb-[80px]', android: 'h-full w-full', ios: 'h-full w-full'})}>
      {(dogGroupsLoading || createDogLoading) && <Loader />}
      {dogGroupInfoError ? <View>
        <Text className='text-center mt-5'>Something went wrong!</Text>
        <TouchableOpacity onPress={() => getAllInfo()} activeOpacity={0.8} className='bg-slate-400 w-[50%] self-center mt-3 p-5 rounded-lg'>
          <Text className='text-center color-white font-bold text-xl'>Retry</Text>
        </TouchableOpacity>
      </View > : (
        <FlatList
        data={[]} // No actual list items
        renderItem={null as any}
        keyExtractor={() => 'form'} // Prevent key warning
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        ListHeaderComponent={
          <View className="flex gap-5" style={Platform.select({web: {paddingBottom: 120}})}>
            <Dropdown
              dropdownKey="community"
              dropdownTitle="Select Community"
              allItems={communityFilterItems}
              onChange={handleValueChange}
              isDisabled={false}
              isRequired={requiredFields.indexOf('community') !== -1}
            />
            <Dropdown
              dropdownKey="group"
              dropdownTitle="Select dog group"
              allItems={dogGroupFilterItems}
              onChange={handleValueChange}
              isDisabled={!formData.community}
              isRequired={requiredFields.indexOf('group') !== -1}
            />
            <Textbox
              formKey='dogName'
              title='Dog Name'
              maxLength={100}
              value={formData.dogName}
              onChange={handleValueChange}
              isRequired={requiredFields.indexOf('dogName') !== -1}
              placeholder='Sheru'
            />
            <Textbox
              formKey='dob'
              title='Date of Birth'
              maxLength={10}
              value={formData.dob}
              onChange={handleValueChange}
              isRequired={requiredFields.indexOf('dob') !== -1}
              placeholder='dd-mm-yyyy'
            />
            <View>
              <View className='flex flex-row justify-between items-end mb-2'>
                <Text>Vaccination Details</Text>
                <TouchableOpacity className='mr-2' onPress={handleAddVaccinationDetailsBlock}>
                  <Text className='p-2 border rounded-lg'>+ Add</Text>
                </TouchableOpacity>
              </View>
              <View className='p-4 pt-6 border border-primary-200 bg-gray-200 rounded-lg flex gap-5'>
                {formData.vaccinationDetails.length === 0 ? (
                  <Text className='text-center text-gray-500 relative -top-1'>
                    Click + Add to start adding vaccination details
                  </Text>
                ) : (
                  formData.vaccinationDetails.map((_, index) => (
                    <VaccinationDetailsBlock
                      key={index}
                      values={formData.vaccinationDetails[index]}
                      onDelete={() => handleDeleteVaccinationDetailsBlock(index)}
                      onUpdate={(updatedData) => handleUpdateVaccinationDetails(updatedData, index)}
                    />
                  ))
                )}
              </View>
            </View>
            <View className='flex flex-row justify-evenly'>
              <Checkbox label="ABC Done" formKey='abcStatus' onChange={handleValueChange} />
              <Checkbox
                label="Vaccination Status"
                formKey='vaccinationStatus'
                onChange={handleValueChange}
                isDisabled={true}
                isChecked={formData.vaccinationStatus}
                additionalInfo="Updated automatically!"
              />
            </View>
            <ImageUploader formKey="image" isImageAvailable={formData.image ? true : false} onChange={(formKey, imageData) => handleValueChange(formKey, imageData)} />
            <TouchableOpacity onPress={onSubmitForm} activeOpacity={0.8}>
              <Text className='text-xs text-danger mb-1 opacity-80'>
                *This information cannot be updated!
              </Text>
              <Text className="mb-5 text-lg font-rubik-medium bg-black-300 text-blue-100 p-3 border rounded-lg text-center">
                Create 🐶
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
      )}
      
    </SafeAreaView>
  )
}

type TVaccinationDetailsFormData = {
  vaccinationName: string | null;
  veterinaryName: string | null;
  vaccinationDate: string | null;
}

const VaccinationDetailsBlock = ({ values, onDelete, onUpdate }: { values: TVaccinationDetailsFormData, onDelete: () => void, onUpdate: (updatedData: TVaccinationDetailsFormData) => void }) => {
  const [formData, setFormData] = useState<TVaccinationDetailsFormData>(values);

  const handleValueChange = (formKey: string, selectedValue: string | null) => {
    setFormData(prev => ({...prev, [formKey]: selectedValue}));
    const updatedData: TVaccinationDetailsFormData = {
      ...formData,
      [formKey]: selectedValue
    };
    onUpdate(updatedData)
  }

  useEffect(() => {
    setFormData(values);
  }, [values]);

  const handleOnDelete = () => {
    onDelete();
  }

  return (
    <View className='relative p-4 border border-primary-200 bg-white rounded-lg'>
      <TouchableOpacity
        className='absolute right-2 top-2 z-50'
        onPress={handleOnDelete}
        activeOpacity={0.5}
      >
        <Image
          source={icons.deleteIcon}
          style={Platform.select({
            web: { height: 20, width: 20 },
            android: { height: 24, width: 24 },
            ios: { height: 24, width: 24 }
          })} 
        />
      </TouchableOpacity>
      <Textbox
        formKey='vaccinationName'
        title='Vaccination Name'
        value={formData.vaccinationName}
        onChange={handleValueChange}
        placeholder='Parvo'
      />
      <View className='flex flex-row gap-4 mt-4'>
        <View className='flex-1'>
          <Textbox
            formKey='veterinaryName'
            title='Veterinary Name'
            value={formData.veterinaryName}
            onChange={handleValueChange}
            isRequired={false}
            placeholder='Dr. Aman'
          />
        </View>
        <View className='flex-1'>
          <Textbox
            formKey='vaccinationDate'
            title='Vaccination Date'
            maxLength={10}
            value={formData.vaccinationDate}
            onChange={handleValueChange}
            isRequired={false}
            placeholder='dd-mm-yyyy'
          />
        </View>
      </View>
    </View>
  )
}

export default CreateNewDog;