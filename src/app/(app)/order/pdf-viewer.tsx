import Feather from '@expo/vector-icons/Feather';
import { ThemedSafeAreaView } from 'components';
import { router, useLocalSearchParams } from 'expo-router';
import { Dimensions, Share, StyleSheet, Image } from 'react-native';
import Pdf from 'react-native-pdf';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, YStack, XStack, View } from 'tamagui';

const { width, height } = Dimensions.get('window');
export default function PdfViewer() {
  const insets = useSafeAreaInsets();
  const { url, title } = useLocalSearchParams();
  const rawUrl = (url as string) || '';
  const isLocalPath = rawUrl.startsWith('/') && !rawUrl.startsWith('http');
  const resolvedUrl = isLocalPath ? `file://${rawUrl}` : rawUrl;
  const source = { uri: resolvedUrl, cache: true };

  const lowerUrl = resolvedUrl.toLowerCase();
  const isPdf = lowerUrl.endsWith('.pdf') || lowerUrl.includes('mime=application/pdf');
  const isImage =
    lowerUrl.endsWith('.jpg') ||
    lowerUrl.endsWith('.jpeg') ||
    lowerUrl.endsWith('.png') ||
    lowerUrl.endsWith('.webp');

  const sharePdf = () => {
    Share.share({ url: url as string });
  };

  return (
    <ThemedSafeAreaView edges={[]} style={styles.container}>
      <YStack flex={1}>
        <XStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          paddingTop={insets.top}
          paddingBottom={12}
          paddingHorizontal={16}
          backgroundColor="rgba(0,0,0,0.75)"
          alignItems="center"
          justifyContent="space-between"
          zIndex={99}
          height={insets.top + 56}
          width={width}>
          <View width={40} height={40} />

          <Text
            color="#108910"
            fontSize={16}
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </Text>

          <Button unstyled onPress={router.back} pressStyle={{ opacity: 0.6 }}>
            <Text fontSize={16} fontWeight="600" color="#108910">
              Done
            </Text>
          </Button>
        </XStack>

        {isPdf ? (
          <Pdf
            source={source}
            onLoadComplete={(pages) => console.log(`PDF loaded. Pages: ${pages}`)}
            onError={(err) => console.log('PDF load error:', err)}
            style={styles.content}
          />
        ) : isImage ? (
          <Image
            source={{ uri: resolvedUrl }}
            resizeMode="contain"
            style={styles.content}
            onError={(err) => console.log('Image load error:', err.nativeEvent)}
          />
        ) : (
          <Pdf
            source={source}
            onLoadComplete={(pages) => console.log(`PDF loaded. Pages: ${pages}`)}
            onError={(err) => console.log('PDF load error:', err)}
            style={styles.content}
          />
        )}

        <View
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          backgroundColor="rgba(0,0,0,0.75)"
          zIndex={99}
          paddingHorizontal={28}
          paddingTop={16}
          width={width}
          height={insets.bottom + 40}>
          <Button unstyled width={40} height={40} onPress={sharePdf} pressStyle={{ opacity: 0.6 }}>
            <Feather color="#108910" name="download" size={20} />
          </Button>
        </View>
      </YStack>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  pdf: {
    flex: 1,
    width,
    height,
  },
  content: {
    flex: 1,
    width,
    height,
    backgroundColor: 'black',
  },
});
