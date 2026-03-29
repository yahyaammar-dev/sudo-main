import { router } from 'expo-router';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { Button } from 'tamagui';

function BackButton({ onPress }: { onPress?: () => void }) {
  return (
    <Button
      onPress={onPress ?? router.back}
      backgroundColor="white"
      borderColor="#000"
      borderWidth={1}
      padding={8}
      width={40}
      height={40}
      pressStyle={{ opacity: 0.7 }}>
      <ArrowLeft2 size={24} color="#000" />
    </Button>
  );
}

export default BackButton;
