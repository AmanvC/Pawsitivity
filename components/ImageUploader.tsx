import React, { useCallback, useEffect, useState } from "react";
import { 
  View, Image, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import icons from "@/constants/icons";
import { useFocusEffect } from "expo-router";

const ImageUploader = ({formKey, onChange}: {formKey: string, onChange: (formKey: string, uri: string | null) => void}) => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setImage(null);
    }, [])
  );

  // Function to handle image selection from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your gallery.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(formKey, result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  // Function to capture an image using the camera
  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your camera.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      onChange(formKey, result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  // Function to upload image to a server
  // const uploadImage = async () => {
  //   if (!image) {
  //     Alert.alert("No Image Selected", "Please select an image first.");
  //     return;
  //   }

  //   setUploading(true);
  //   let formData = new FormData();
  //   formData.append("file", {
  //     uri: image,
  //     name: "photo.jpg",
  //     type: "image/jpeg",
  //   });

  //   try {
  //     let response = await fetch("https://your-api.com/upload", {
  //       method: "POST",
  //       body: formData,
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     let responseJson = await response.json();
  //     Alert.alert("Upload Successful", "Your image has been uploaded!");
  //     console.log("Response:", responseJson);
  //   } catch (error) {
  //     Alert.alert("Upload Failed", "Something went wrong!");
  //     console.error("Upload Error:", error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  return (
    <View>
      <Text className="mb-3 text-md">Dog Image<Text className="text-danger">*</Text></Text>

      <View className="flex flex-row gap-x-4">
        <TouchableOpacity 
          className="flex-1 bg-slate-400 p-4 justify-center rounded-lg"
          activeOpacity={0.8}
          onPress={pickImage}
        >
          <View className="flex flex-row justify-center items-center">
            <Text className="text-white font-rubik-medium text-center">
              Upload
            </Text>
            <Image source={icons.uploadWhite} className='size-6 ml-2 relative bottom-0.5'/>
          </View>
          
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-slate-400 p-4 justify-center rounded-lg"
          activeOpacity={0.8}
          onPress={captureImage}
        >
          <View className="flex flex-row justify-center items-center">
            <Text className="text-white font-rubik-medium text-center">
              Capture
            </Text>
            <Image source={icons.cameraWhite} className='size-6 ml-2 relative bottom-0.5'/>
          </View>
        </TouchableOpacity>
      </View>

      {image && (
        <>
          <View className="w-full mt-4 flex items-center">
            <Image source={{ uri: image }} className="h-96 w-52 rounded-xl border border-black-300" />
          </View>
          {/* <TouchableOpacity 
            style={[styles.button, styles.uploadButton]} 
            onPress={uploadImage}
            disabled={uploading}
          >
            {uploading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Upload Image</Text>}
          </TouchableOpacity> */}
        </>
      )}
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({});
