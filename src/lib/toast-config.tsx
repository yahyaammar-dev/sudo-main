import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#10b981',
        borderRadius: 28,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 13,
        color: '#ffffff',
        textAlign: 'center',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#ef4444',
        borderRadius: 28,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
      }}
      text2Style={{
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'center',
      }}
    />
  ),
  warning: (props: any) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#f59e0b',
        borderRadius: 28,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 13,
        color: '#ffffff',
        textAlign: 'center',
      }}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: '#3b82f6',
        borderRadius: 28,
        borderLeftWidth: 0,
      }}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: 13,
        color: '#ffffff',
        textAlign: 'center',
      }}
    />
  ),
};
