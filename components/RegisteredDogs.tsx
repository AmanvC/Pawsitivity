import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Filters, { TFilterDataType } from './Filters'
import icons from "@/constants/icons";
import { Mocks } from '@/constants/mocks';
import { Utils } from '@/lib/utils';
import images from '@/constants/images';

const RegisteredDogs = () => {
  const [dogsData, setDogsData] = useState<TDogItemProps[]>(Mocks.getDogsList());
  const filters = Mocks.getDogsListFilters();

  const onFilterChange = (updatedFilters: TFilterDataType) => {
    const selectedFilters = updatedFilters.filter(filterItem => filterItem.isSelected);
    let updatedDogsList: TDogItemProps[] = [];
    if(selectedFilters.length === 0) {updatedDogsList = Mocks.getDogsList()}
    selectedFilters.forEach(selectedFilterItem => {
      const filteredList = Mocks.getDogsList().filter(dog => dog.dogMetadata.dogGroup.value === selectedFilterItem.value);
      updatedDogsList.push(...filteredList);
    })
    setDogsData(updatedDogsList);
  }

  return (
    <SafeAreaView className='h-full w-full'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View className='mb-5'>
          <Filters filters={filters} onFilterChange={onFilterChange} />
        </View>
        {
          dogsData.map(dogItem => (
            <DogItem
              key={dogItem.dogMetadata.dogId}
              dogMetadata={dogItem.dogMetadata}
              vaccinationDetails={dogItem.vaccinationDetails}
            />
          ))
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export type TDogItemProps = {
  dogMetadata: {
    dogId: string;
    dogName: string;
    dob: Date;
    vaccinationStatus: 'Pending' | 'Vaccinated',
    dogGroup: {label: string, value: string},
    registrationDate: Date;
    imageUrl?: string;
    abcStatus: 'Done' | 'Pending'
  },
  vaccinationDetails: {
    vaccinationName: string;
    vetName: string;
    date: Date
  }[];
}

const DogItem = ({dogMetadata, vaccinationDetails}: TDogItemProps): React.ReactNode => {
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
            {dogMetadata.imageUrl ? <Image source={images.dog} resizeMode="cover" /> : <Text className='text-3xl font-medium'>{Utils.getGroupNameAvatar(dogMetadata.dogName)}</Text>}
          </View>
          <View className='flex-1'>
            <Text className='text-xl font-rubik-medium'>{dogMetadata.dogName}</Text>
            <Text>DOB: {Utils.getFormattedDate(dogMetadata.dob)}</Text>
            <Text>Age: {Utils.getAgeString(dogMetadata.dob)}</Text>
            <View className='flex flex-row items-center justify-evenly gap-2 p-2 w-full border border-gray-200 rounded-md mt-4'>
              <View className='flex flex-row gap-2 items-center'>
                <Text>Vaccination</Text>
                <View className={`rounded-md h-6 w-6 flex items-center border justify-center ${dogMetadata.vaccinationStatus === 'Vaccinated' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`} style={{ alignSelf: 'flex-start' }} />
              </View>
              <View className='border-l border-dotted border-black-100 h-5/6'/>
              <View className='flex flex-row gap-2 items-center'>
                <Text>ABC</Text>
                <View className={`rounded-md h-6 w-6 flex items-center border justify-center ${dogMetadata.abcStatus === 'Done' ? 'bg-green-100 border-green-400' : 'bg-red-100 border-red-400'}`} style={{ alignSelf: 'flex-start' }} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View>
        <View className='pt-3 pb-3 border-t border-gray-200'>
          {dogMetadata.imageUrl
            ? <View className="items-center justify-center">
                <Image 
                  source={images.dog}
                  // TODO - AMAN Update the source once backend is ready
                  className="w-full rounded-lg" 
                  resizeMode="cover"
                />
              </View>
            : <Text className='text-center font-rubik-medium text-gray-300'>No Image Available!</Text>
          }
        </View>
        {vaccinationDetails.length !== 0 && (
          <View className='mb-2 pb-3 pt-3 border-t border-gray-200'>
            <Text className='font-rubik-medium'>Last Vaccination details</Text>
            <View>
              <Text className=''>Name: <Text className='font-rubik-medium'>{vaccinationDetails[0].vaccinationName}</Text></Text>
              <Text className=''>Date: <Text className='font-rubik-medium'>{Utils.getFormattedDate(vaccinationDetails[0].date)}</Text></Text>
              <Text className=''>Vaccinated By: <Text className='font-rubik-medium'>{vaccinationDetails[0].vetName}</Text></Text>
            </View>
          </View>
        )}
        <View className='pt-3 border-t border-gray-200'>
          <Text className='font-rubik-medium mb-1'>Vaccination History</Text>
          {vaccinationDetails.length === 0 ? <Text className='text-gray-500'>No vaccination details available!</Text> : <TableComponent vaccinationDetails={vaccinationDetails} />}
        </View>
        <Text className='text-xs w-full text-right mt-2 text-gray-500'>Date Registered: {Utils.getFormattedDate(dogMetadata.registrationDate)}</Text>
      </View>
    </View>
  )
}

const TableComponent = ({vaccinationDetails}: {vaccinationDetails: TDogItemProps['vaccinationDetails']}) => {
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
          <View className={`pt-1 pb-1 flex-1 items-center justify-center border-r border-black-300 ${index !== vaccinationDetails.length - 1 && 'border-b'}`}>
            <Text className="text-center p-2">{vaccinationDetail.vaccinationName}</Text>
          </View>
          <View className={`pt-1 pb-1 flex-1 justify-center border-black-300 ${index !== vaccinationDetails.length - 1 && 'border-b'}`}>
            <Text className="text-center">Vet: <Text className="font-rubik-medium">{vaccinationDetail.vetName}</Text></Text>
            <Text className="text-center">Date: <Text className="font-rubik-medium">{Utils.getFormattedDate(vaccinationDetail.date)}</Text></Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default RegisteredDogs