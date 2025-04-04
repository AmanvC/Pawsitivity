import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Filters, { TFilterDataType } from './Filters'
import icons from "@/constants/icons";
import { Utils } from '@/lib/utils';
import { useApi } from '@/lib/useApi';
import { TFilterType, TRegisteredDogDTO, TREQUEST_GetRegisteredDogs, TRESPONSE_GetRegisteredDogs, TVaccinationDetailDTO } from '@/lib/types';
import { useAuth } from '@/context/AuthProvider';
import Loader from './Loader';
import { showFailureToast } from '@/lib/toastHandler';

const RegisteredDogs = () => {
  const [dogsData, setDogsData] = useState<TRegisteredDogDTO[]>([]);
  const [filteredDogsData, setFilteredDogsData] = useState<TRegisteredDogDTO[]>([]);
  const [filters, setFilters] = useState<TFilterType[]>([]);
  
  const { selectedCommunity } = useAuth();

  useEffect(() => {
    callApi();
  }, []);

  const { callApi, responseData, loading, error } = useApi<TRESPONSE_GetRegisteredDogs>({ method: 'POST', url: 'dog/getAll', data: { communityId: selectedCommunity?._id } as TREQUEST_GetRegisteredDogs })

  useEffect(() => {
    if(responseData) {
      setDogsData(responseData.dogsList);
      setFilteredDogsData(responseData.dogsList);
      const filters = responseData.filters.map(filter => ({label: filter.groupName, value: filter.groupName}));
      setFilters(filters);
    }
  }, [responseData])

  useEffect(() => {
    console.log({error})
    if(error) {
      showFailureToast(error || 'Something went wrong!')
    }
  }, [error])

  const onFilterChange = (updatedFilters: TFilterDataType) => {
    const selectedFilters = updatedFilters.filter(filterItem => filterItem.isSelected);
    let updatedDogsList: TRegisteredDogDTO[] = [];
    if(selectedFilters.length === 0) {
      setFilteredDogsData(dogsData);
      return;
    }
    selectedFilters.forEach(selectedFilterItem => {
      const filteredList = dogsData.filter(dog => dog.dogGroup.groupName === selectedFilterItem.value);
      updatedDogsList.push(...filteredList);
    })
    setFilteredDogsData(updatedDogsList);
  }

  return (
    <SafeAreaView className='h-full w-full'>
      {loading && <Loader />}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View className='mb-5'>
          <Filters filters={filters} onFilterChange={onFilterChange} />
        </View>
        {
          filteredDogsData.map(dogItem => (
            <DogItem
              key={dogItem._id}
              dogMetadata={dogItem}
            />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

const DogItem = ({dogMetadata}: {dogMetadata: TRegisteredDogDTO}): React.ReactNode => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <View className={`p-4 mb-4 rounded-md border border-gray-300 overflow-hidden ${isExpanded ? 'h-auto' : 'h-44'}`}>
      <Image source={isExpanded ? icons.chevronUp : icons.chevronDown} className='size-12 absolute right-0 top-0 opacity-50 '/>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsExpanded(prev => !prev)}
      >
        <View className='flex flex-row gap-5 mb-5'>
          <View className='h-24 w-24 bg-gray-100 rounded-full flex justify-center items-center overflow-hidden'>
            {dogMetadata.image ? <Image source={{ uri: dogMetadata.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" /> : <Text className='text-3xl font-medium'>{Utils.getGroupNameAvatar(dogMetadata.dogName)}</Text>}
          </View>
          <View className='flex-1'>
            <Text className='text-xl font-rubik-medium'>{dogMetadata.dogName}</Text>
            <Text>DOB: {dogMetadata.dob ? Utils.getFormattedDate(dogMetadata.dob) : 'Not Available'}</Text>
            <Text>Age: {dogMetadata.dob ? Utils.getAgeString(dogMetadata.dob) : 'Not Available'}</Text>
            <View className='flex flex-row items-center justify-evenly gap-2 p-2 w-full border border-gray-200 rounded-md mt-4'>
              <View className='flex flex-row gap-2 items-center'>
                <Text>Vaccination</Text>
                <View className={`rounded-md h-6 w-6 flex items-center border justify-center ${dogMetadata.vaccinationStatus ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`} style={{ alignSelf: 'flex-start' }} />
              </View>
              <View className='border-l border-dotted border-black-100 h-5/6'/>
              <View className='flex flex-row gap-2 items-center'>
                <Text>ABC</Text>
                <View className={`rounded-md h-6 w-6 flex items-center border justify-center ${dogMetadata.abcStatus ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`} style={{ alignSelf: 'flex-start' }} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View>
        <View className='pt-3 pb-3 border-t border-gray-200'>
          {dogMetadata.image
            ? <View className="items-center justify-start">
                <Image 
                  source={{ uri: dogMetadata.image }}
                  className="w-full aspect-[9/16] rounded-lg" 
                  resizeMode="cover"
                />
              </View>
            : <Text className='text-center font-rubik-medium text-gray-300'>No Image Available!</Text>
          }
        </View>
        {dogMetadata.vaccinationDetails.length !== 0 && (
          <View className='mb-2 pb-3 pt-3 border-t border-gray-200'>
            <Text className='font-rubik-medium'>Last Vaccination details</Text>
            <View>
              <Text className=''>Name: <Text className='font-rubik-medium'>{dogMetadata.vaccinationDetails[0].vaccinationName}</Text></Text>
              <Text className=''>Date: <Text className='font-rubik-medium'>{dogMetadata.vaccinationDetails[0].vaccinationDate ? Utils.getFormattedDate(dogMetadata.vaccinationDetails[0].vaccinationDate) : 'Not Available'}</Text></Text>
              <Text className=''>Vaccinated By: <Text className='font-rubik-medium'>{dogMetadata.vaccinationDetails[0].veterinaryName || 'Not Available'}</Text></Text>
            </View>
          </View>
        )}
        <View className='pt-3 border-t border-gray-200'>
          <Text className='font-rubik-medium mb-1'>Vaccination History</Text>
          {dogMetadata.vaccinationDetails.length === 0 ? <Text className='text-gray-500'>No vaccination details available!</Text> : <TableComponent vaccinationDetails={dogMetadata.vaccinationDetails} />}
        </View>
        <Text className='text-xs w-full text-right mt-2 text-gray-500'>Last Updated By: {dogMetadata.lastUpdatedBy.name} on {Utils.getFormattedDate(dogMetadata.updatedAt)}</Text>
      </View>
    </View>
  )
}

const TableComponent = ({vaccinationDetails}: {vaccinationDetails: TVaccinationDetailDTO[]}) => {
  return (
    <View className="border border-black-300">
      {/* Table Header */}
      <View className="flex flex-row p-0 bg-gray-200 h-12">
        <View className="flex-1 items-center justify-center border-r border-b border-black-300 ">
          <Text className="font-bold text-center p-2">Vaccination Name</Text>
        </View>
        <View className="flex-1 items-center justify-center border-b border-black-300 ">
          <Text className="font-bold text-center p-2">Details</Text>
        </View>
      </View>

      {/* Table Data */}
      {vaccinationDetails.map((vaccinationDetail, index) => (
        <View key={index} className="flex flex-row p-0 min-h-12">
          <View className={`p-1 flex-1 items-center justify-center border-r border-black-300 ${index !== vaccinationDetails.length - 1 && 'border-b'}`}>
            <Text className="text-center p-2">{vaccinationDetail.vaccinationName}</Text>
          </View>
          <View className={`p-1 flex-1 justify-center border-black-300 ${index !== vaccinationDetails.length - 1 && 'border-b'}`}>
            <Text className="text-center">Vet: <Text className="font-rubik-medium">{vaccinationDetail.veterinaryName || 'Not Available'}</Text></Text>
            <Text className="text-center">Date: <Text className="font-rubik-medium">{vaccinationDetail.vaccinationDate ? Utils.getFormattedDate(vaccinationDetail.vaccinationDate) : 'Not Available'}</Text></Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default RegisteredDogs;