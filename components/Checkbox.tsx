import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import icons from '@/constants/icons';

type TProps = {
  label: string;
  formKey: string
  isChecked?: boolean;
  isDisabled?: boolean;
  onChange: (formKey: string, value: boolean) => void
  additionalInfo?: string
}

const Checkbox = ({ label, formKey, isChecked = false, isDisabled = false, onChange, additionalInfo }: TProps) => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(isChecked);

  const handleToggle = () => {
    setIsCheckboxChecked(prev => !prev);
    onChange(formKey, !isCheckboxChecked);
  }

  useEffect(() => { setIsCheckboxChecked(isChecked) }, [isChecked])

  return (
    <View className=''>
      <View className='flex flex-row gap-2 items-center'>
        <TouchableOpacity className={`size-7 rounded-lg border border-black-100 ${isDisabled && 'opacity-50'}`} onPress={handleToggle} disabled={isDisabled}>
          {isCheckboxChecked && <Image source={icons.check} className='absolute size-6'/>}
        </TouchableOpacity>
        <Text className={`${isDisabled && 'opacity-50'}`}>{label}</Text>
      </View>
      {additionalInfo && <Text className='text-[9px] text-gray-400 relative ml-10 -top-1'>*{additionalInfo}</Text>}
    </View>
  )
}

export default Checkbox

const styles = StyleSheet.create({})