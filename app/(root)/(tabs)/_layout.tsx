import { Tabs } from "expo-router";
import { Image, ImageSourcePropType, Platform, Text, View } from "react-native";

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
  <View
    className={Platform.select({
      ios: "flex-1 mt-2 flex flex-col items-center",
      android: "flex-1 mt-2 flex flex-col items-center",
      web: "flex-1 flex flex-col items-center h-full justify-center",
    })}
  >
    <Image
      source={icon}
      tintColor={focused ? "#191D31" : "#666876"}
      resizeMode="contain"
      style={Platform.select({
        ios: { width: 24, height: 24 },
        android: { width: 24, height: 24 },
        web: { width: 20, height: 20 },
      })}
    />
    <Text
      className={`${
        focused
          ? "text-black-300 font-rubik-extraBold"
          : "text-black-100 font-rubik-medium"
      } ${Platform.select({
        ios: "text-xs",
        android: "text-xs",
        web: "text-sm",
      })} text-center mt-1 w-full`}
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
              <TabIcon focused={focused} icon={icons.dog} title="Dogs" />
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