import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  message?: string;
  duration?: number;
  type?: ToastType;
}

const toastTypes = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;

export const showToast = (options: ToastOptions) => {
  const { title, message, duration, type = 'info' } = options;

  Toast.show({
    type: toastTypes[type],
    text1: title || message || '',
    text2: title ? message : undefined,
    position: 'top',
    visibilityTime: duration || 3000,
    autoHide: true,
    topOffset: 50,
  });
};

// Convenience methods for different toast types
export const showSuccessToast = (message: string, title?: string) => {
  showToast({ title, message, type: 'success' });
};

export const showErrorToast = (message: string, title?: string) => {
  showToast({ title, message, type: 'error' });
};

export const showWarningToast = (message: string, title?: string) => {
  showToast({ title, message, type: 'warning' });
};

export const showInfoToast = (message: string, title?: string) => {
  showToast({ title, message, type: 'info' });
};
