import { CountryCode as LibPhoneNumberCountryCode } from 'libphonenumber-js';
import { CountryCode } from 'types';

export const convertCountryCode = (code: CountryCode): LibPhoneNumberCountryCode | undefined => {
  return code as LibPhoneNumberCountryCode;
};
