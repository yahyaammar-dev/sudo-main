import { Feather } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import ZoomableImage from './ZoomableImage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ImageViewerModalProps = {
  images: string[];
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
};

const ImageViewerModal = ({ images, visible, initialIndex, onClose }: ImageViewerModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const listRef = useRef<FlatList<string>>(null);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setCurrentIndex(index);
    },
    []
  );

  const handleShow = useCallback(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: initialIndex * SCREEN_WIDTH, animated: false });
    });
  }, [initialIndex]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <ZoomableImage uri={item} active={index === currentIndex} onZoomChange={setIsZoomed} />
    ),
    [currentIndex]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      onShow={handleShow}
      statusBarTranslucent>
      <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={12}>
        <Feather name="x" size={22} color="#fff" />
      </TouchableOpacity>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        scrollEnabled={!isZoomed}
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.container}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default ImageViewerModal;
