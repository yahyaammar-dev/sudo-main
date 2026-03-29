import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { YStack, XStack, Text, Button, View } from 'tamagui';

import { XIcon } from '../../../../assets/icons';

export type SortOption = {
  id: string;
  label: string;
  value: string;
};

interface SortOptionsBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  selectedSortOption: string;
  onSortOptionSelect: (option: SortOption) => void;
}

const sortOptions: SortOption[] = [
  { id: '1', label: 'A-Z', value: 'a-z' },
  { id: '2', label: 'Lowest MOQ', value: 'lowest-moq' },
  { id: '3', label: 'Shortest Lead Time', value: 'shortest-lead-time' },
  { id: '4', label: 'Lowest Price', value: 'lowest-price' },
];

const SortOptionsBottomSheet: React.FC<SortOptionsBottomSheetProps> = ({
  bottomSheetModalRef,
  selectedSortOption,
  onSortOptionSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<SortOption | null>(
    sortOptions.find((option) => option.value === selectedSortOption) || sortOptions[0]
  );
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    []
  );

  const handleSortOptionPress = (option: SortOption) => {
    onSortOptionSelect(option);
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      handleStyle={styles.handle}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}>
      <BottomSheetView
        style={[styles.contentContainer, { paddingBottom: insets.bottom + 25, paddingTop: 25 }]}>
        <YStack gap={16}>
          <XStack gap={8} justifyContent="flex-start" alignItems="center" paddingVertical={8}>
            <View
              padding={8}
              backgroundColor="#fff"
              borderWidth={1}
              borderColor="#D8DADC"
              borderRadius={10}
              alignItems="center"
              justifyContent="center">
              <XIcon size={15} color="#000" />
            </View>
            <Text fontSize={18} fontWeight="600" color="#000">
              Sort by
            </Text>
          </XStack>

          <YStack gap={8}>
            {sortOptions.map((option) => (
              <XStack
                flex={1}
                justifyContent="space-between"
                alignItems="center"
                cursor="pointer"
                key={option.id}
                gap={12}
                paddingVertical={8}
                onPress={() => setSelectedOption(option)}
                borderBottomColor="#D9D9D9"
                borderBottomWidth={1}>
                <Text fontSize={16} fontWeight="500" color="#000">
                  {option.label}
                </Text>
                <View
                  width={20}
                  height={20}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor="#000"
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="#fff">
                  {selectedOption?.value === option.value && (
                    <View width={12} height={12} borderRadius={6} backgroundColor="#000" />
                  )}
                </View>
              </XStack>
            ))}
          </YStack>

          <Button
            backgroundColor="#108910"
            height={54}
            onPress={() => {
              if (selectedOption) {
                handleSortOptionPress(selectedOption);
              }
            }}
            borderRadius={27}
            marginTop={16}>
            <Text color="#fff" fontSize={17} fontWeight="500" textAlign="center">
              Apply
            </Text>
          </Button>
        </YStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    display: 'none',
  },
  handleIndicator: {
    backgroundColor: '#D1D5DB',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default SortOptionsBottomSheet;
