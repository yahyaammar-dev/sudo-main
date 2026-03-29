import { Octicons } from '@expo/vector-icons';
import { InformationStep, ThemedSafeAreaView, UploadDocument } from 'components';
import { StepIndicator } from 'components/ui';
import { useCountrySelection, useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import { Button, Text, View, YStack } from 'tamagui';
import { Country } from 'types';

type FormData = {
  fullName: string;
  companyName: string;
  country: Country;
  registrationNumber: string;
  crDocument: any | null;
  idDocument: any | null;
};

function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const { country } = useCountrySelection();
  const { translations } = useTranslation();
  const methods = useForm<FormData>({
    defaultValues: {
      fullName: '',
      companyName: '',
      country: undefined,
      registrationNumber: '',
      crDocument: null,
      idDocument: null,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    methods.setValue('country', country as Country);
  }, [country]);
  const handleNext = async () => {
    let canProceed = false;

    if (currentStep === 1) {
      canProceed = await methods.trigger(['fullName', 'companyName', 'registrationNumber']);
    } else if (currentStep === 2) {
      canProceed = await methods.trigger('crDocument');
    } else if (currentStep === 3) {
      canProceed = await methods.trigger('idDocument');
    }

    if (canProceed) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = (data: FormData) => {
    setCurrentStep(4);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <InformationStep onContinue={handleNext} />;
      case 2:
        return (
          <UploadDocument
            fieldName="crDocument"
            title={translations.UploadCompanyDocuments}
            description={translations.UploadCompanyDocumentsDescription}
            onContinue={handleNext}
          />
        );
      case 3:
        return (
          <UploadDocument
            fieldName="idDocument"
            title={translations.UploadPersonalID}
            description={translations.UploadPersonalIDDescription}
            onContinue={handleNext}
          />
        );
      case 4:
        return (
          <YStack pt={120} paddingHorizontal={10} alignItems="center" gap={40}>
            <View
              bg="#50C878"
              width={122.5}
              height={122.5}
              borderRadius={100}
              alignItems="center"
              justifyContent="center">
              <Octicons name="check" size={80} color="#fff" />
            </View>
            <YStack alignItems="center" gap={10}>
              <Text fontSize={30} fontWeight="700" color="#0B0B0B">
                {translations.thankYouForYourSubmission}
              </Text>
              <Text fontSize={16} color="#000000B2">
                {translations.yourApplicationIsUnderReview}
              </Text>
            </YStack>
          </YStack>
        );
      default:
        return null;
    }
  };
  return (
    <ThemedSafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'bottom']}>
      <FormProvider {...methods}>
        <YStack flex={1}>
          {currentStep < 4 && (
            <Button
              marginLeft={16}
              marginTop={16}
              marginBottom={30}
              width={40}
              height={40}
              borderRadius={10}
              borderColor="#D8DADC"
              backgroundColor="transparent"
              onPress={handleBack}>
              <ArrowLeft2 size={20} color="#000" />
            </Button>
          )}

          <View width="100%" px={30}>
            {currentStep < 4 && <StepIndicator currentStep={currentStep} />}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              flexGrow: 1,
              backgroundColor: '#FFFFFF',
            }}>
            {renderStep()}
          </ScrollView>
        </YStack>
      </FormProvider>
    </ThemedSafeAreaView>
  );
}

export default SignupScreen;
