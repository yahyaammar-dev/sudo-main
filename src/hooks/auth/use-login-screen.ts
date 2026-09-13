import { use$ } from '@legendapp/state/react';
import { useSendOtp } from 'api/mutations';
import { userStore } from 'store';

type UseAuthSubmitProps = {
  phoneNumber: string;
  countryCode?: string | null;
};

// Countries whose numbering plan makes the leading digit part of the real
// subscriber number rather than a droppable trunk prefix (e.g. Ivory Coast's
// 2021 renumbering added this digit to every mobile number). Stripping it
// produces an invalid, undeliverable number.
const KEEP_LEADING_ZERO_COUNTRIES = ['CI', 'BJ', 'CG'];

// Hungary's trunk prefix is the two-digit "06", not a single "0" — stripping
// only the first character leaves a stray "6" in the number.
const HU_TRUNK_PREFIX = '06';

const normalizeLocalNumber = (phoneNumber: string, countryCode?: string | null) => {
  if (countryCode === 'HU' && phoneNumber.startsWith(HU_TRUNK_PREFIX)) {
    return phoneNumber.slice(HU_TRUNK_PREFIX.length);
  }

  if (countryCode && KEEP_LEADING_ZERO_COUNTRIES.includes(countryCode)) {
    return phoneNumber;
  }

  return phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber;
};

export const useLoginScreen = ({ phoneNumber, countryCode }: UseAuthSubmitProps) => {
  const { userInfo } = use$(userStore);
  const { mutate: sendOtp, status, error, data } = useSendOtp();
  const handleSubmit = () => {
    if (!phoneNumber || !userInfo?.country) {
      return;
    }
    const formattedNumber = normalizeLocalNumber(phoneNumber, countryCode);

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
