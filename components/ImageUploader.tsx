import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import icons from "@/constants/icons";
import { useFocusEffect } from "expo-router";

interface ImageUploaderProps {
  formKey: string;
  isImageAvailable?: boolean;
  onChange: (formKey: string, imageData: {
    uri: string;
    type: string;
    name: string;
  } | null) => void;
}

const ImageUploader = ({ formKey, onChange, isImageAvailable }: ImageUploaderProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setImage(null);
    }, [])
  );

  useEffect(() => {
    if(!isImageAvailable) setImage(null);
  }, [isImageAvailable]);

  const handleImageSelection = async (fromCamera = false) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== "granted") {
      Alert.alert("Permission required", `Please allow access to your ${fromCamera ? "camera" : "gallery"}.`);
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [9, 16],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [9, 16],
          quality: 1,
        });

    if (!result.canceled) {
      const asset = result.assets[0];
      const imageData = {
        uri: asset.uri,
        name: asset.fileName || "image.jpg",
        type: asset.type || "image/jpeg",
      };

      setImage(asset.uri);
      onChange(formKey, imageData);
    }
  };

  return (
    <View>
      <Text className="mb-3 text-md">
        Dog Image<Text className="text-danger">*</Text>
      </Text>

      <View className="flex flex-row gap-x-4">
        <TouchableOpacity
          className="flex-1 bg-slate-400 p-4 justify-center rounded-lg"
          activeOpacity={0.8}
          onPress={() => handleImageSelection(false)}
        >
          <View className="flex flex-row justify-center items-center">
            <Text className="text-white font-rubik-medium text-center">Upload</Text>
            <Image source={icons.uploadWhite} className="size-6 ml-2 relative bottom-0.5" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-slate-400 p-4 justify-center rounded-lg"
          activeOpacity={0.8}
          onPress={() => handleImageSelection(true)}
        >
          <View className="flex flex-row justify-center items-center">
            <Text className="text-white font-rubik-medium text-center">Capture</Text>
            <Image source={icons.cameraWhite} className="size-6 ml-2 relative bottom-0.5" />
          </View>
        </TouchableOpacity>
      </View>

      {image && (
        <View className="w-full mt-4 flex items-center">
          <Image
            source={{ uri: image }}
            className="h-96 w-52 rounded-xl border border-black-300"
          />
        </View>
      )}
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({});
