import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ImageUploader from './ImageUploader'
import Dropdown from './Dropdown'
import Textbox from './Textbox'
import { useFocusEffect } from 'expo-router'
import Checkbox from './Checkbox'
import icons from '@/constants/icons'
import { showInfoToast } from '@/lib/toastHandler'

type TFormData = {
  community: string | null,
  group: string | null,
  dogName: string | null,
  dob: string | null,
  vaccinationStatus: boolean,
  abcStatus: boolean,
  image: string | null,
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

const requiredFields: (keyof TFormData)[] = ['community', 'group', 'dogName', 'dob', 'vaccinationStatus', 'abcStatus', 'image'];

const CreateNewDog = () => {
  const [formData, setFormData] = useState<TFormData>(defaultValues);

  const handleValueChange = (formKey: string, selectedValue: string | boolean | null) => {
    setFormData(prev => ({...prev, [formKey]: selectedValue}));
  }

  const onSubmitForm = () => {
    console.log({formData: JSON.stringify(formData)});
    let isValid = true;
    requiredFields.forEach(field => {
      if(formData[field] == null) {
        isValid = false;
      }
    });
    formData.vaccinationDetails.map(detail => {
      if(!detail.vaccinationName) isValid = false;
    })
    if(!isValid) {
      showInfoToast('Error', 'Please fill all the required fields!')
      return;
    }
  }

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
    console.log("Delete " + index + " Called");
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
      setFormData(defaultValues);
    }, [])
  );

  return (
    <SafeAreaView className='h-full w-full'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
      <View className="flex gap-5">
          <Dropdown
            dropdownKey="community"
            dropdownTitle="Select Community"
            allItems={[{label: 'AIIMS Jodhpur', value: 'aiimsJodhpur'}]} 
            onChange={handleValueChange}
            isDisabled={false}
            isRequired={requiredFields.indexOf('community') !== -1}
          />
          <Dropdown
            dropdownKey="group"
            dropdownTitle="Select dog group"
            allItems={[{label: 'PG Hostel', value: 'pgHostel'}, {label: 'Old Girls Hostel', value: 'ogHostel'}]} 
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
          <View className=''>
            <View className='flex flex-row justify-between items-end mb-2'>
              <Text>Vaccination Details</Text>
              <TouchableOpacity className='mr-2' onPress={handleAddVaccinationDetailsBlock}><Text className='p-2 border rounded-lg'>+ Add</Text></TouchableOpacity>
            </View>
            <View className='p-4 pt-6 border border-primary-200 bg-gray-200 rounded-lg flex gap-5'>
              {formData.vaccinationDetails.length == 0 ? <Text className='text-center text-gray-500 relative -top-1'>Click + Add to start adding vaccination details</Text> : (
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
          <ImageUploader formKey="image" onChange={handleValueChange} />
          <TouchableOpacity onPress={onSubmitForm} activeOpacity={0.8} >
            <Text className='text-xs text-danger mb-1 opacity-80'>*This information cannot be updated!</Text>
            <Text className="mb-5 text-lg font-rubik-medium bg-black-300 text-blue-100 p-3 border rounded-lg text-center">Create 🐶</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
        className='absolute right-4 top-4 z-50'
        onPress={handleOnDelete}
        activeOpacity={0.5}
      >
        <Image className='size-6' source={icons.deleteIcon} />
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

export default CreateNewDog

const styles = StyleSheet.create({})