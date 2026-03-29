import { DocumentItem } from 'components';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { downloadAndShareFile } from 'helpers';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { XStack, YStack, Text, Button } from 'tamagui';

function OrderDocumentsScreen() {
  const { translations } = useTranslation();

  const { documents } = useLocalSearchParams<{
    documents: string;
  }>();

  const documentsData = JSON.parse(documents) as {
    url: string;
    filename: string;
    id: string;
    title: string;
  }[];

  return (
    <YStack flex={1} backgroundColor="white">
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1 }}>
        <XStack paddingVertical={16} paddingHorizontal={16} alignItems="center">
          <Button
            backgroundColor="transparent"
            borderWidth={1}
            borderColor="#000000"
            borderRadius={8}
            width={40}
            height={40}
            onPress={() => router.back()}
            icon={<ArrowLeft2 size={20} color="#000000" />}
          />
          <Text fontSize={18} color="#000000" fontWeight="600" flex={1} textAlign="center">
            {translations.orderDocuments}
          </Text>
        </XStack>

        <YStack
          margin={16}
          padding={16}
          backgroundColor="white"
          borderRadius={17}
          borderWidth={1}
          borderColor="#E5E5E5">
          {documentsData
            .filter((document) => document.url)
            .map((document, index) => (
              <DocumentItem
                key={index}
                document={document}
                documents={documentsData}
                index={index}
                onPress={() => downloadAndShareFile(document.url, `${document?.title}.pdf`)}
              />
            ))}
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}

export default OrderDocumentsScreen;
