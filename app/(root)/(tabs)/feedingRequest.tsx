import AvailableFeedingRequests from "@/components/AvailableFeedingRequests";
import CreateFeedingRequest from "@/components/CreateFeedingRequest";
import SideBySideTabs from "@/components/SideBySideTabs";
import React from "react";
import { Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const feedingRequest = () => {
  return (
    <SafeAreaView className="h-full px-5 bg-white" style={Platform.OS === "web" ? { paddingLeft: 12, paddingRight: 12 } : {}}>
      <Text className="mt-5 mb-4 text-2xl font-rubik-bold">Feeding Request 🦴</Text>
      <SideBySideTabs 
        tabs={[
          {label: 'Pending', content: <AvailableFeedingRequests />},
          {label: 'Create', content: <CreateFeedingRequest />}
        ]}
      />
    </SafeAreaView>
  )
}

export default feedingRequest

const styles = StyleSheet.create({});