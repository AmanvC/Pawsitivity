import { Platform, StyleSheet, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SideBySideTabs from '@/components/SideBySideTabs'
import RegisteredDogs from '@/components/RegisteredDogs'
import CreateNewDog from '@/components/CreateNewDog'

const dogDetails = () => {
  return (
    <SafeAreaView className="h-full px-5 bg-white" style={Platform.OS === "web" ? { paddingLeft: 12, paddingRight: 12 } : {}}>
      <Text className="mt-5 mb-4 text-2xl font-rubik-bold">Dogs 🐶</Text>
      <SideBySideTabs 
        tabs={[
          {label: 'Registered', content: <RegisteredDogs />},
          {label: 'Create New', content: <CreateNewDog />}
        ]}
      />
    </SafeAreaView>
  )
}

export default dogDetails

const styles = StyleSheet.create({})