import { BaseToast, ErrorToast, ToastConfig, InfoToast } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
      style={{ height: 'auto', padding: 20, borderLeftColor: '#4CAF50' }}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
      style={{ height: 'auto', padding: 20, borderColor: 'lightblue' }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1NumberOfLines={0}
      text2NumberOfLines={0}
      style={{ height: 'auto', padding: 20, borderLeftColor: 'red' }}
    />
  ),
};
