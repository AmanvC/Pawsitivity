import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TableScreen = () => {
  return (
    <View className="border border-black-300">
      {/* Table Header */}
      <View className="flex flex-row p-0 bg-gray-200 h-12">
        <View className="flex-1 items-center justify-center border-r border-b border-black-300 ">
          <Text className="font-bold text-center p-2">Vaccination Name</Text>
        </View>
        <View className="flex-1 items-center justify-center border-b border-black-300 ">
          <Text className="font-bold text-center p-2">Details</Text>
        </View>
      </View>

      {/* Table Data */}
      <View className="flex flex-row p-0 min-h-12">
        <View className="flex-1 items-center justify-center border-r  border-black-300 ">
          <Text className="text-center p-2">Rabies</Text>
        </View>
        <View className="flex-1  justify-center border-black-300 mt-1 mb-1">
          <Text className="text-center">Vet: <Text className="font-rubik-medium">Ganji Chudail</Text></Text>
          <Text className="text-center">Date: <Text className="font-rubik-medium">2025-03-12</Text></Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 10 },
  cell: {  textAlign: "center", fontSize: 16, borderRightWidth: 1, backgroundColor: 'red' },
  header: {  paddingVertical: 10 },
});

export default TableScreen;
