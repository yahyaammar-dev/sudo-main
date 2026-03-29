import { Location, TickCircle } from 'iconsax-react-nativejs';
import { View } from 'tamagui';

function LocationPin({ completed }: { completed: boolean }) {
  return (
    <View width={24} height={30} alignItems="center" justifyContent="center">
      <View width={24} height={30} alignItems="center" justifyContent="center">
        <Location size={27} color="#002C5F" variant="Bold" />
      </View>

      {completed && (
        <View
          width={16}
          height={16}
          alignItems="center"
          justifyContent="center"
          position="absolute"
          top={0}
          left={-2}
          borderRadius={8}
          backgroundColor="#fff"
          borderWidth={1}
          borderColor="#fff">
          <TickCircle size={12} color="#4CAF50" variant="Bold" />
        </View>
      )}
    </View>
  );
}

export default LocationPin;
