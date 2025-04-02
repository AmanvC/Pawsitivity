import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from 'expo-router'

type TProps = {
  formKey: string,
  title: string,
  maxLength?: number,
  value: string | null,
  onChange: (key: string, text: string) => void
  isRequired?: boolean
  placeholder?: string
  isHidden?: boolean
}

const Textbox = ({ formKey, title, maxLength = 100, value, onChange, isRequired = true, placeholder, isHidden = false }: TProps) => {
  const [inputValue, setInputValue] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setInputValue(null);
    }, [])
  );

  useEffect(() => { setInputValue(value) }, [value]);

  const handleChange = (text: string) => {
    setInputValue(text);
    onChange(formKey, text)
  }

  return (
    <View>
      <Text>{ title }{isRequired && <Text className='text-danger'>*</Text>}</Text>
      <TextInput
        editable
        maxLength={maxLength}
        numberOfLines={1}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor={'lightgray'}
        secureTextEntry={isHidden}
        value={inputValue || ''}
        className="p-3 border rounded-xl mt-2 border-primary-200 align-top"
      />
    </View>
  )
}

export default Textbox

const styles = StyleSheet.create({})