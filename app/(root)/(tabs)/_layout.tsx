import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Text, View } from "react-native";

import icons from "@/constants/icons";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}) => (
  <View className="flex-1 mt-3 flex flex-col items-center">
    <Image
      source={icon}
      tintColor={focused ? "#191D31" : "#666876"}
      resizeMode="contain"
      className="size-6"
    />
    <Text
      className={`${
        focused
          ? "text-black-300 font-rubik-medium"
          : "text-black-100 font-rubik"
      } text-xs w-full text-center mt-1`}
    >
      {title}
    </Text>
  </View>
);

const TabsLayout = () => {
  return (
    <View className="h-full flex flex-col justify-between">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            borderTopColor: "#0061FF1A",
            borderTopWidth: 1,
            minHeight: 70,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            ),
          }}
        />
        <Tabs.Screen
          name="feedingRequest"
          options={{
            title: "Request",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.search} title="Request" />
            ),
          }}
        />
        <Tabs.Screen
          name="dogDetails"
          options={{
            title: "Dogs",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.person} title="Dogs" />
            ),
          }}
        />
        {/* <Tabs.Screen // TODO - AMAN Create a new component report.tsx, and add reporting of dogs functionality there
          name="report"
          options={{
            title: "Report",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.person} title="Report" />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.person} title="Profile" />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabsLayout;