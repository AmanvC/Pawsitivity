import DateRangePicker from "@/components/DateRangePicker";
import Dropdown from "@/components/Dropdown";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, Text, TextInput, Button, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TFormData = {
  community: string | null,
  dog: string | null,
  fromDate: string | null,
  toDate: string | null,
  message: string | null
}

const feedingRequest = () => {
  const requiredFields: (keyof TFormData)[] = ['community', 'dog', 'fromDate'];

  const [formData, setFormData] = useState<TFormData>({
    community: null,
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
        dog: null,
        fromDate: null,
        toDate: null,
        message: null
      });
    }, [])
  );

  console.log({formData})

  return (
    <SafeAreaView className="h-full px-7 bg-white">
      <Text className="mt-5 text-2xl font-rubik-bold">Feeding Request</Text>
      <ScrollView className='flex-1 mt-4' showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-10 flex gap-2">
          <Dropdown
            dropdownKey="community"
            dropdownTitle="Select Community"
            allItems={[{label: 'AIIMS Jodhpur', value: 'aiimsJodhpur'}]} 
            onChange={handleDropdownChange}
            isDisabled={false}
            isRequired={true}
          />
          <Dropdown
            dropdownKey="dog"
            dropdownTitle="Select a Dog"
            allItems={[{label: 'Sheru Lal', value: 'sheru'}, {label: 'Caspuuuu', value: 'casper'}]} 
            onChange={handleDropdownChange}
            isDisabled={!formData.community}
            isRequired={true}
          />
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

        <TouchableOpacity onPress={onSubmitForm}>
          <Text className="mt-5 font-rubik-medium bg-black-300 text-blue-100 p-2 border rounded-lg text-center">Create Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default feedingRequest

const styles = StyleSheet.create({});