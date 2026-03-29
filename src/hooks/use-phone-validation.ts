import { parsePhoneNumberFromString, isValidPhoneNumber, CountryCode } from 'libphonenumber-js/min';
import { useState, useEffect, useCallback } from 'react';
import { Country } from 'types';

export type ValidationErrorType = 'INVALID_FORMAT' | 'INVALID_COUNTRY' | 'INVALID_NUMBER' | null;

export type PhoneValidationResult = {
  isValid: boolean;
  isPossible: boolean;
  formattedNumber: string | null;
  nationalNumber: string | null;
  internationalNumber: string | null;
  countryCode: string | null;
  error: ValidationErrorType;
  errorMessage: string | null;
  rawInput: string;
};

const DEFAULT_DEBOUNCE_TIME = 300;

const COUNTRY_RULES: Record<
  string,
  {
    normalize: (input: string) => string;
  }
> = {
  KE: {
    normalize: (input: string) => {
      if (input.startsWith('0')) return input.slice(1);

      return input;
    },
  },
};

const applyCountryRules = (input: string, country: Country) => {
  const rule = COUNTRY_RULES[country.cca2];
  return rule ? rule.normalize(input) : input;
};

export const usePhoneValidation = (
  phoneNumber: string,
  country: Country | null,
  options?: { debounceTime?: number }
) => {
  const debounceTime = options?.debounceTime ?? DEFAULT_DEBOUNCE_TIME;

  const [result, setResult] = useState<PhoneValidationResult>({
    isValid: false,
    isPossible: false,
    formattedNumber: null,
    nationalNumber: null,
    internationalNumber: null,
    countryCode: null,
    error: null,
    errorMessage: null,
    rawInput: phoneNumber,
  });

  const sanitize = useCallback((input: string) => {
    if (!input) return '';
    const hasPlus = input.startsWith('+');
    const digits = input.replace(/[^\d]/g, '');
    return hasPlus ? `+${digits}` : digits;
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!country) {
        return setResult((r) => ({
          ...r,
          isValid: false,
          isPossible: false,
          error: 'INVALID_COUNTRY',
          errorMessage: 'Select a country',
          countryCode: null,
        }));
      }

      const raw = phoneNumber;
      const cleaned = sanitize(phoneNumber);

      if (!cleaned) {
        return setResult({
          isValid: false,
          isPossible: false,
          formattedNumber: null,
          nationalNumber: null,
          internationalNumber: null,
          countryCode: country.cca2,
          error: null,
          errorMessage: null,
          rawInput: raw,
        });
      }

      const localNumber = cleaned.startsWith('+') ? cleaned : applyCountryRules(cleaned, country);

      const full = cleaned.startsWith('+') ? cleaned : `+${country.callingCode[0]}${localNumber}`;

      let parsed;
      try {
        parsed = parsePhoneNumberFromString(full, country.cca2.toUpperCase() as CountryCode);
      } catch {
        parsed = null;
      }

      if (!parsed) {
        return setResult({
          isValid: false,
          isPossible: true,
          formattedNumber: null,
          nationalNumber: null,
          internationalNumber: null,
          countryCode: country.cca2,
          error: null,
          errorMessage: null,
          rawInput: raw,
        });
      }

      const isPossible = parsed.isPossible();
      const isValid = isValidPhoneNumber(parsed.number);

      let error: ValidationErrorType = null;
      if (!isPossible) error = 'INVALID_FORMAT';
      else if (!isValid) error = 'INVALID_NUMBER';

      setResult({
        isValid,
        isPossible,
        formattedNumber: parsed.formatInternational(),
        nationalNumber: parsed.formatNational(),
        internationalNumber: parsed.number,
        countryCode: parsed.country || country.cca2,
        error,
        errorMessage:
          error === 'INVALID_FORMAT'
            ? 'Phone number format is invalid'
            : error === 'INVALID_NUMBER'
              ? 'Phone number is not valid'
              : null,
        rawInput: raw,
      });
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [phoneNumber, country, debounceTime, sanitize]);

  return result;
};
