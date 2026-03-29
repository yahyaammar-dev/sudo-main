import { AnimatedInput, CountryPickerInput } from 'components/ui';
import { useTranslation } from 'hooks';
import { useFormContext } from 'react-hook-form';
import { YStack, Text, Button } from 'tamagui';

interface InformationStepProps {
  onContinue: () => void;
}

function InformationStep({ onContinue }: InformationStepProps) {
  const { translations } = useTranslation();
  const { control } = useFormContext();
  return (
    <YStack flex={1} justifyContent="space-between">
      <YStack gap={40}>
        <YStack marginTop="13" marginBottom="$4" gap={13}>
          <Text fontSize={30} fontWeight="700" color="#000">
            {translations.createYourAccount}
          </Text>
          <Text fontSize={16} color="#000000B2">
            {translations.welcomeSignupMessage}
          </Text>
        </YStack>

        <YStack gap={17}>
          <AnimatedInput
            control={control}
            name="fullName"
            label={translations.fullLegalName}
            required
          />
          <AnimatedInput
            control={control}
            name="companyName"
            label={translations.companyName}
            required
          />
          <CountryPickerInput
            wrapperProps={{
              backgroundColor: '#EBEBEB',
              gap: 2,
              flex: 1,
            }}
            control={control}
            name="country"
            label={translations.country}
            required
          />
          <AnimatedInput
            control={control}
            name="registrationNumber"
            label={translations.registrationNumber}
            placeholder={translations.typeCommercialRegistration}
            required
          />
        </YStack>
      </YStack>

      <Button
        backgroundColor="#108910"
        color="#fff"
        fontWeight="600"
        fontSize={16}
        height={56}
        borderRadius={27}
        onPress={onContinue}>
        {translations.continue}
      </Button>
    </YStack>
  );
}

export default InformationStep;
