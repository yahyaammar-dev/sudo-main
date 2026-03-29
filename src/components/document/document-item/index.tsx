import { router } from 'expo-router';
import { DocumentText } from 'iconsax-react-nativejs';
import { TouchableWithoutFeedback } from 'react-native';
import { Text, XStack } from 'tamagui';

type DocumentItemProps = {
  document: {
    url: string;
    filename: string;
    id: string;
    title: string;
  };
  documents: DocumentItemProps['document'][];
  index: number;
  onPress: () => void;
};

function DocumentItem({ document, index, documents, onPress }: DocumentItemProps) {
  return (
    <TouchableWithoutFeedback onPress={() => {
      router.push({
        pathname: "/order/pdf-viewer",
        params: {
          url: document.url,
          title: document.title,
        },
      })
    }}>
      <XStack
        key={index}
        justifyContent="space-between"
        alignItems="center"
        paddingVertical={16}
        paddingHorizontal={27}
        borderBottomWidth={index < documents.length - 1 ? 1 : 0}
        borderBottomColor="#f5f5f5">
        <Text color="#000000" fontWeight="500" fontSize={16}>
          {document.title}
        </Text>
        <DocumentText size={20} color="#667085" />
      </XStack>
    </TouchableWithoutFeedback>
  );
}

export default DocumentItem;
