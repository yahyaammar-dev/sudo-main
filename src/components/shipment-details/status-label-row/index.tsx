import { XStack, Text } from 'tamagui';

type StatusLabelRowProps = {
  icon: React.ReactNode;
  label: string;
};

function StatusLabelRow({ icon, label }: StatusLabelRowProps) {
  return (
    <XStack paddingLeft={50} alignItems="center" gap={8}>
      {icon}
      <Text fontSize={14} color="#000">
        {label}
      </Text>
    </XStack>
  );
}

export default StatusLabelRow;
