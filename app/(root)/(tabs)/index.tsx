import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text>Edit app/index.tsx to edit this screen.</Text> */}
      <Text className="font-bold my-10 font-rubik text-4xl">Welcome to Pawsitivity</Text>
      <Link href='/sign-in'>Signin</Link>
      <Link href='/home'>Home</Link>
      <Link href='/dogDetails'>Dog Details</Link>
      <Link href='/feedingRequest'>Feeding Request</Link>
      <Link href='/report'>Report Missing</Link>
      <Link href='/properties/1'>Property</Link>
    </View>
  );
}
