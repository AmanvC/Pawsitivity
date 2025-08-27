import {
  Image,
  ImageSourcePropType,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import icons from "@/constants/icons";
import { settings } from "@/constants/data";
import { useAuth } from "@/context/AuthProvider";
import { useApi } from "@/lib/useApi";
import { useEffect } from "react";
import { showFailureToast, showInfoToast, showSuccessToast } from "@/lib/toastHandler";
import { Utils } from "@/lib/utils";
import Loader from "@/components/Loader";
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
    <Image
        source={icon}
        style={Platform.select({
          web: { width: 24, height: 24 }, 
          android: { width: 24, height: 24 },
          ios: { width: 24, height: 24 },
        })}
      />
      <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`} style={Platform.select({web: {fontSize: 16}})}>
        {title}
      </Text>
    </View>

    {showArrow && 
      <Image
        source={icons.rightArrow}
        style={Platform.select({
          web: { width: 20, height: 20 }, 
          android: { width: 20, height: 20 },
          ios: { width: 20, height: 20 },
        })}
      />
    }
  </TouchableOpacity>
);

type TApiResponse = {
  status: "SUCCESS" | "FAILURE",
  message: string
}

const Profile = () => {
  const { logout, user, jwtToken } = useAuth();
  const { callApi, error, loading, responseData } = useApi<TApiResponse>({method: 'POST', url: 'auth/logout'});

  const router = useRouter();

  const handleLogout = async () => {
    callApi({ token: jwtToken });
  };

  useEffect(() => {
    if(responseData) {
      if(responseData.status === 'SUCCESS') {
        logout();
        showSuccessToast('Logged out successfully.');
        // router.push("/(auth)/sign-in");
      } else {
        showFailureToast('Something went wrong!', 'Failed to logout!');
      }
    }
  }, [responseData]);

  useEffect(() => {
    if(error) {
      showFailureToast('Something went wrong!', error)
    }
  }, [error]);

  const handleComingSoon = () => {
    showInfoToast("Thankyou for showing interest! This section will be launching soon.")
  }

  const goToFeedingRequestHistoryPage = () => {
    router.push('/feedingRequestsHistory');
  }
  const handleUserUpdateSelectedCommunity = () => {
    router.replace({
      pathname: "/selectCommunity",
      params: { allowUserToChangeCommunity: "true" },
    });
  }

  return (
    <SafeAreaView className="h-full bg-white">
      {loading && <Loader />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32 px-5"
      >
        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="text-2xl font-rubik-bold">Profile</Text>
          <Image
            source={icons.bell}
            style={Platform.select({
              web: { width: 24, height: 24 }, 
              android: { width: 24, height: 24 },
              ios: { width: 24, height: 24 },
            })}
          />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <View
              className="bg-black-300 rounded-full h-44 w-44 flex items-center justify-center"
              style={Platform.select({
                web: { height: 132, width: 132 }
              })}  
            >
              <Text
                className="text-8xl text-white relative top-3"
                style={Platform.select({
                  web: { top: 0, fontSize: 72 }
                })}  
              >{Utils.getGroupNameAvatar(user?.data.name || '')}</Text>
            </View>
            <Text className="text-2xl font-rubik-bold mt-2">{user?.data.name}</Text>
          </View>
        </View>

        <View className="flex flex-col mt-10">
          <SettingsItem icon={icons.calendar} title="Feeding Requests" onPress={goToFeedingRequestHistoryPage} />
          <SettingsItem icon={icons.dog} title="Change Community" onPress={handleUserUpdateSelectedCommunity} />
          {/* <SettingsItem icon={icons.wallet} title="Reports History" onPress={handleComingSoon} /> */}
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