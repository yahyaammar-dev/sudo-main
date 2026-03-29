import { use$ } from '@legendapp/state/react';
import { useSendOtp } from 'api/mutations';
import { userStore } from 'store';

type UseAuthSubmitProps = {
  phoneNumber: string;
};

export const useLoginScreen = ({ phoneNumber }: UseAuthSubmitProps) => {
  const { userInfo } = use$(userStore);
  const { mutate: sendOtp, status, error, data } = useSendOtp();
  const handleSubmit = () => {
    if (!phoneNumber || !userInfo?.country) {
      return;
    }
    const formattedNumber = phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber;

    const fullNumber = Number(`${userInfo?.country}${formattedNumber}`);

    sendOtp({ toPhoneNumber: fullNumber, country: userInfo?.country, phoneNumber });
  };

  return {
    handleSubmit,
    status,
    error,
    data,
  };
};
