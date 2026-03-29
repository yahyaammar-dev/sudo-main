import { useTranslation } from 'hooks';
import { XStack, Circle, Text, View } from 'tamagui';

type StepIndicatorProps = {
  currentStep: number;
};

function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { translations } = useTranslation();

  const steps = [
    { id: 1, label: translations.information },
    { id: 2, label: translations.uploadCR },
    { id: 3, label: translations.verifyID },
  ];

  return (
    <XStack width="100%" alignItems="center" justifyContent="space-between">
      {steps.map((step, index) => (
        <XStack key={step.id} alignItems="center" flex={index === steps.length - 1 ? 0 : 1}>
          <XStack alignItems="center" gap={4}>
            <Circle size={23} backgroundColor={step.id <= currentStep ? '#50C878' : '#E5E5E5'}>
              <Text fontSize={13} color="#fff" fontWeight="700">
                {step.id}
              </Text>
            </Circle>
            <Text fontSize={10} fontWeight="600" color="#000">
              {step.label}
            </Text>
          </XStack>

          {index < steps.length - 1 && (
            <View
              flex={1}
              height={2}
              marginLeft={4}
              marginRight={4}
              backgroundColor={step.id < currentStep ? '#50C878' : '#D9D9D9'}
            />
          )}
        </XStack>
      ))}
    </XStack>
  );
}

export default StepIndicator;
