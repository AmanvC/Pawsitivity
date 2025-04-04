import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React from 'react'

const Loader = () => {
  return (
   <View className="absolute top-0 left-0 h-full w-full bg-white/50 flex justify-center items-center" style={{ zIndex: 9999 }}>
   <ActivityIndicator size={60} color="#191D31" />

  </View>
  )
}

export default Loader

const styles = StyleSheet.create({})