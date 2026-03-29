import { Text, View, XStack, XStackProps } from 'tamagui';

import BackButton from '../back-button';

type HeaderProps = {
  title: string | React.ReactNode;
  stackProps?: XStackProps;
  center?: boolean;
  onBackPress?: () => void;
};

function Header({ title, stackProps, onBackPress, center }: HeaderProps) {
  return (
    <XStack
      {...stackProps}
      paddingHorizontal={16}
      paddingVertical={12}
      alignItems="center"
      {...(center ? { justifyContent: 'space-between' } : {})}>
      <BackButton onPress={onBackPress} />
      {typeof title === 'string' ? (
        <Text fontSize={18} fontWeight="600" marginLeft={12}>
          {title}
        </Text>
      ) : (
        title
      )}
      {center && <View width={50} height={50} />}
    </XStack>
  );
}

export default Header;
