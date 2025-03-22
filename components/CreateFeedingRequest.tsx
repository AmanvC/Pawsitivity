import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Dropdown from './Dropdown'
import DateRangePicker from './DateRangePicker'
import { useFocusEffect } from 'expo-router'

type TFormData = {
  community: string | null,
  group: string | null,
  dog: string | null,
  fromDate: string | null,
  toDate: string | null,
  message: string | null
}

const CreateFeedingRequest = () => {
  const requiredFields: (keyof TFormData)[] = ['community', 'group', 'fromDate'];

  const [formData, setFormData] = useState<TFormData>({
    community: null,
    group: null,
    dog: null,
    fromDate: null,
    toDate: null,
    message: null
  })

  const handleDropdownChange = (dropdownKey: string, selectedValue: string) => {
    setFormData(prev => ({...prev, [dropdownKey]: selectedValue}));
  }

  const onDateChange = (fromDate: string | null, toDate: string | null) => {
    setFormData(prev => ({...prev, fromDate, toDate}));
  }

  const onSubmitForm = () => {
    console.log({formData});
    let isValid = true;
    requiredFields.forEach(field => {
      if(!formData[field]) {
        isValid = false;
      }
    });
    if(!isValid) {
      Alert.alert('Error', 'Please fill all the required fields!');
      return;
    }
  }

  useFocusEffect(
    useCallback(() => {
      setFormData({
        community: null,
        group: null,
        dog: null,
        fromDate: null,
        toDate: null,
        message: null
      });
    }, [])
  );

  const dogsList = ['Sheru', 'Leechee', 'Megan', 'Dubi', 'Lambu']; // TODO - AMAN Get this list from API

  return (
    <SafeAreaView>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="flex gap-5">
          <Dropdown
            dropdownKey="community"
            dropdownTitle="Select Community"
            allItems={[{label: 'AIIMS Jodhpur', value: 'aiimsJodhpur'}]} 
            onChange={handleDropdownChange}
            isDisabled={false}
            isRequired={requiredFields.indexOf('community') !== -1}
          />
          <Dropdown
            dropdownKey="group"
            dropdownTitle="Select dog group"
            allItems={[{label: 'PG Hostel', value: 'pgHostel'}, {label: 'Old Girls Hostel', value: 'ogHostel'}]} 
            onChange={handleDropdownChange}
            isDisabled={!formData.community}
            isRequired={requiredFields.indexOf('group') !== -1}
          />
          {/* <Dropdown
            dropdownKey="dog"
            dropdownTitle="Select a Dog"
            allItems={[{label: 'Sheru Lal', value: 'sheru'}, {label: 'Caspuuuu', value: 'casper'}]} 
            onChange={handleDropdownChange}
            isDisabled={!(formData.community && formData.group)}
            isRequired={requiredFields.indexOf('dog') !== -1}
          /> */}
          {formData.group && (
            <View className='flex flex-row flex-wrap relative -top-3'>
              <Text className='text-sm'>Requesting for: </Text>
              {dogsList.map((dog, index) => (
                <Text className='font-medium text-sm'>{dog}{dogsList.length === index + 1 ? "" : ", "}</Text>
              ))}
            </View>
          )}
        </View>

        <DateRangePicker onDateChange={onDateChange} isRequired={true} />

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
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateFeedingRequest

const styles = StyleSheet.create({})