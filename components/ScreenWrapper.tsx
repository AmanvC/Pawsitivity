import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, SafeAreaView } from "react-native";

type ScreenWrapperProps = {
  children: React.ReactNode;
};

export default function ScreenWrapper({ children }: ScreenWrapperProps) {
  return (
    <SafeAreaView className='bg-white h-full w-full flex-1'>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={50}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: 'auto' }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
