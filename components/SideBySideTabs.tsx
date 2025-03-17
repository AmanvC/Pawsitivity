import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type TabItem = {
  label: string;
  content: React.ReactNode;
};

type SideBySideTabsProps = {
  tabs: TabItem[];
  currentActiveTab?: number
};

const SideBySideTabs: React.FC<SideBySideTabsProps> = ({ tabs, currentActiveTab }) => {
  const [activeTab, setActiveTab] = useState(currentActiveTab ? currentActiveTab : 0);

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>{tabs[activeTab].content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 10},
  tabContainer: {
    flexDirection: "row",
    borderRadius: 8,
    padding: 5,
    backgroundColor: "#191D31", // Default background for inactive tabs
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "transparent", // Default transparent background
  },
  activeTab: {
    backgroundColor: "#fff", // Active tab background color
  },
  tabText: { fontSize: 16, color: "#fff" }, // Default text color (white)
  activeTabText: { color: "#191D31", fontWeight: "bold" }, // Active tab text color (#191D31)
  content: { marginTop: 20, alignItems: "center" },
});

export default SideBySideTabs;
