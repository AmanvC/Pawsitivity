import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Filters, { TFilterDataType } from './Filters'
import icons from "@/constants/icons";
import TableScreen from './TableScreen';
import { Mocks } from '@/constants/mocks';

const RegisteredDogs = () => {

  const filters = [
    {label: 'PG Hostel', value: 'pgHostel'},
    {label: 'Departmental Store', value: 'departmentalStore'},
    {label: 'Old Girls Hostel', value: 'oldGirlsHostel'},
  ]

  const onFilterChange = (updatedFilters: TFilterDataType) => {
    console.log({updatedFilters})
    // TODO - AMAN Call the listing API / filter from frontend itself
  }

  return (
    <SafeAreaView className='h-full w-full'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <View className='mb-5'>
          <Filters filters={filters} onFilterChange={onFilterChange} />
        </View>
        {
          Mocks.getDogsList().map(dogItem => (
            <DogItem
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
    dogName: string;
    dob: Date;
    vaccinationStatus: 'Pending' | 'Vaccinated',
    dogGroup: {label: string, value: string}
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
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setIsExpanded(prev => !prev)}
      // className='p-4 mb-4 rounded-md border border-gray-300 h-36'
      className={`p-4 mb-4 rounded-md border border-gray-300 overflow-hidden ${isExpanded ? 'h-auto' : 'h-36'}`}
    >
      <Image source={isExpanded ? icons.chevronUp : icons.chevronDown} className='size-12 absolute right-4 top-2 text-black-300'/>
      <View className='flex flex-row gap-5'>
        <View className='h-20 w-20 bg-gray-100 rounded-full flex justify-center items-center'>
          <Text>SL</Text>
        </View>
        <View>
          <Text className='text-xl font-rubik-medium'>Sheru Lal</Text>
          <Text>DOB: 24/11/18</Text>
          <Text>Age: 6 Years</Text>
          <Text>Vaccination Status: <Text className='text-red-600 font-rubik-medium'>Pending</Text></Text>
        </View>
      </View>
      <View className='mt-6'>
        <View className='mb-2 pb-3 pt-3 border-b border-t border-gray-200'>
          <Text className='font-rubik-medium'>Last Vaccination details</Text>
          <Text className=''>Name: <Text className='font-rubik-medium'>Rabies</Text></Text>
          <Text className=''>Date: <Text className='font-rubik-medium'>2025-03-12</Text></Text>
          <Text className=''>Vaccinated By: <Text className='font-rubik-medium'>Ganji Chudail</Text></Text>
        </View>
        <View>
          <Text className='font-rubik-medium mb-1'>Vaccination History</Text>
          <TableScreen />
          {/* <View className=''>

          </View> */}
        </View>
        <Text className='text-sm w-full text-right mt-2'>Date Registered: 2025-03-19</Text>
      </View>
    </TouchableOpacity>
  )
}

export default RegisteredDogs

const styles = StyleSheet.create({})