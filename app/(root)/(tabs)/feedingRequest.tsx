import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const feedingRequest = () => {
  return (
    <SafeAreaView className="h-full bg-white">
      <Text className="mt-5 px-7 text-xl font-rubik-bold">Feeding Request</Text>
      
    </SafeAreaView>
  )
}

export default feedingRequest

const styles = StyleSheet.create({})