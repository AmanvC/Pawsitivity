import {
  Alert,
  Image,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// import { logout } from "@/lib/appwrite";
// import { useGlobalContext } from "@/lib/global-provider";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";
import { useAuth } from "@/context/AuthProvider";
import { useApi } from "@/lib/useApi";
import { useEffect } from "react";
import { useRouter } from "expo-router";

interface SettingsItemProp {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingsItem = ({
  icon,
  title,
  onPress,
  textStyle,
  showArrow = true,
}: SettingsItemProp) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex flex-row items-center justify-between py-3"
  >
    <View className="flex flex-row items-center gap-3">
      <Image source={icon} className="size-6" />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>
        {title}
      </Text>
    </View>

    {showArrow && <Image source={icons.rightArrow} className="size-5" />}
  </TouchableOpacity>
);

type TApiResponse = {
  status: "SUCCESS" | "FAILURE",
  message: string
}

const Profile = () => {

  const router = useRouter();
  const { logout, user } = useAuth();
  const { callApi, error, loading, responseData } = useApi<TApiResponse>({method: 'POST', url: 'auth/logout', data: {token: user}});

  const handleLogout = async () => {
    console.log({user})
    callApi();
  };

  useEffect(() => {
    if(responseData) {
      if(responseData.status === 'SUCCESS') {
        logout();
        Alert.alert("Success", "Logged out successfully");
        router.push("/(auth)/sign-in");
      } else {
        Alert.alert('Error', 'Failed to logout!')
      }
    }
  }, [responseData]);

  const handleComingSoon = () => {
    Alert.alert('Coming Soon!', 'Thank-you for showing interest, this section will be launched soon.');
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-5"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-2xl font-rubik-bold">Profile</Text>
          <Image source={icons.bell} className="size-5" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            {/* TODO - AMAN Fix this */}
            {/* <Image
              source={{ uri: user?.avatar }}
              className="size-44 relative rounded-full"
            />

            <Text className="text-2xl font-rubik-bold mt-2">{user?.name}</Text> */}
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="Feeding Requests" onPress={handleComingSoon} />
          <SettingsItem icon={icons.wallet} title="Reports History" onPress={handleComingSoon} />
        </View>

        <View className="flex flex-col mt-5 border-t pt-5 border-primary-200">
          {settings.slice(2).map((item, index) => (
            <SettingsItem key={index} {...item} onPress={handleComingSoon} />
          ))}
        </View>

        <View className="flex flex-col border-t mt-5 pt-5 border-primary-200">
          <SettingsItem
            icon={icons.logout}
            title="Logout"
            textStyle="text-danger"
            showArrow={false}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;