import { UploadFileCard } from 'components/ui';
import { useTranslation } from 'hooks';
import { Controller, useFormContext } from 'react-hook-form';
import { Button, Text, YStack } from 'tamagui';

type UploadDocumentProps = {
  fieldName: string;
  title: string;
  description: string;
  onContinue: () => void;
};

function UploadDocument({ fieldName, title, description, onContinue }: UploadDocumentProps) {
  const { control } = useFormContext();
  const { translations } = useTranslation();

  return (
    <YStack bg="$white" flex={1} justifyContent="space-between">
      <YStack gap={40}>
        <YStack marginTop="13" marginBottom="$4" gap={13}>
          <Text fontSize={30} fontWeight="700" color="#000">
            {title}
          </Text>
          <Text fontSize={16} color="#000000B2">
            {description}
          </Text>
        </YStack>

        <Controller
          control={control}
          name={fieldName}
          render={({ field, fieldState }) => (
            <UploadFileCard
              onChange={field.onChange}
              value={field.value}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              maxSize={20}
            />
          )}
        />
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

export default UploadDocument;
