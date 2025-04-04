import Toast from "react-native-toast-message";

export const showSuccessToast = (heading: string, message?: string) => {
  Toast.show({
    type: "success",
    text1: heading,
    ...(message ? { text2: message } : {})
  });
}

export const showFailureToast = (heading: string, message?: string) => {
  Toast.show({
    type: "error",
    text1: heading,
    ...(message ? { text2: message } : {})
  });
}

export const showInfoToast = (heading: string, message?: string) => {
  Toast.show({
    type: "info",
    text1: heading,
    ...(message ? { text2: message } : {})
  });
}