import { Ionicons, Octicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'hooks';
import { DocumentText1, DocumentUpload, Trash } from 'iconsax-react-nativejs';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { Card, Text, Button, YStack, XStack, View, AnimatePresence } from 'tamagui';

import { UploadIcon } from '../../../../assets/icons';

export type FileInfo = {
  uri: string;
  name: string;
  size: number;
  mimeType: string;
};

export interface FileUploadCardProps {
  value?: FileInfo | null;
  onChange: (file: FileInfo | null) => void;
  onBlur?: () => void;
  error?: string;
  maxSize?: number;
  allowedTypes?: string[];
  label?: string;
  buttonText?: string;
  description?: string;
  onUpload?: (file: FileInfo) => Promise<void>;
  uploadProgress?: number;
  uploadError?: string;
  animationDuration?: number;
  autoUpload?: boolean;
}

export const FileUploadCard: React.FC<FileUploadCardProps> = ({
  value = null,
  onChange,
  onBlur,
  error,
  maxSize = 20,
  allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'],
  buttonText,
  description,
  uploadError,
  animationDuration = 4000,
}) => {
  const { translations } = useTranslation();
  const [internalError, setInternalError] = useState<string | null>(null);
  const [internalProgress, setInternalProgress] = useState<number>(0);
  const [internalIsUploading, setInternalIsUploading] = useState<boolean>(false);
  const [showCheckmark, setShowCheckmark] = useState<boolean>(false);

  const [animatedProgressValue] = useState(new Animated.Value(0));

  const progress = internalProgress;
  const uploading = internalIsUploading;

  // Animate progress bar
  useEffect(() => {
    Animated.timing(animatedProgressValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (progress === 100 && uploading) {
      setShowCheckmark(true);
      const timeout = setTimeout(() => {
        setInternalIsUploading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [progress, uploading]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes,
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;
      const asset = result.assets[0];

      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      const MAX_SIZE_BYTES = maxSize * 1024 * 1024;

      if (fileInfo.exists && fileInfo.size > MAX_SIZE_BYTES) {
        setInternalError(`File size exceeds ${maxSize}MB limit`);
        return;
      }

      setInternalError(null);

      const fileData: FileInfo = {
        uri: asset.uri,
        name: asset.name,
        size: asset.size || 0,
        mimeType: asset.mimeType || '',
      };

      onChange(fileData);
      onBlur?.();

      handleUpload(fileData);
    } catch (error) {
      console.error('Error picking document:', error);
      setInternalError('Error selecting file');
    }
  };

  const handleUpload = async (fileData: FileInfo) => {
    setInternalIsUploading(true);
    setShowCheckmark(false);
    setInternalProgress(0);

    const totalSteps = 20;
    const stepTime = animationDuration / totalSteps;

    for (let step = 1; step <= totalSteps; step++) {
      const progress = Math.round(easeInOutCubic(step / totalSteps) * 100);
      setInternalProgress(progress);
      await new Promise((resolve) => setTimeout(resolve, stepTime));
    }

    setInternalProgress(100);
  };

  const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const removeFile = () => {
    onChange(null);
    setInternalError(null);
    setInternalProgress(0);
    setInternalIsUploading(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return Math.round(bytes / 1024) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const displayError = error || internalError || uploadError;

  return (
    <YStack gap={24}>
      {/* Upload Button Card */}
      <Card
        bordered
        width="100%"
        backgroundColor="#FFFFFF"
        borderColor="#CACACA"
        borderWidth={1}
        borderRadius={12}
        padding={16}>
        <YStack gap={12} paddingHorizontal={50} alignItems="center">
          <View
            width={62}
            height={62}
            borderRadius={50}
            backgroundColor="#F5F5F5"
            justifyContent="center"
            alignItems="center">
            <DocumentUpload size={30} color="#17AB13" />
          </View>

          <Text textAlign="center" color="$gray11">
            {description || translations.SupportedFormats}
          </Text>

          <Button
            onPress={pickDocument}
            backgroundColor="transparent"
            borderColor="#108910"
            color="#108910"
            borderRadius={100}
            paddingHorizontal="$6"
            height={56}
            width="100%"
            disabled={uploading}>
            <Text color="#108910" fontWeight="600" fontSize={16}>
              {uploading ? 'Uploading...' : buttonText || translations.selectFile}
            </Text>
            <UploadIcon size={18} color="#108910" />
          </Button>

          {displayError && (
            <XStack
              gap={4}
              alignItems="center"
              backgroundColor="$red2"
              padding={8}
              borderRadius={4}
              width="100%">
              <Ionicons name="alert-circle" size={18} color="#FF0404" />
              <Text color="#FF0404">{displayError}</Text>
            </XStack>
          )}
        </YStack>
      </Card>

      {/* File Card */}
      {value && (
        <Card
          bordered
          width="100%"
          maxWidth={400}
          padding={16}
          borderColor="#CACACA"
          backgroundColor="white">
          <XStack justifyContent="space-between" alignItems="center" width="100%">
            <XStack gap={8} alignItems="center" flex={1}>
              <DocumentText1 size={32} color="#353535" />
              <YStack>
                <Text fontWeight="500" fontSize={14} color="#353535">
                  {value?.name}
                </Text>
                <Text color="#989692" fontSize={12}>
                  {formatFileSize(value?.size || 0)}
                </Text>
              </YStack>
            </XStack>
            <XStack gap={8}>
              <AnimatePresence>
                {showCheckmark ? (
                  <View
                    width={20}
                    height={20}
                    backgroundColor="#50C878"
                    borderRadius={100}
                    justifyContent="center"
                    alignItems="center">
                    <Octicons name="check" size={14} color="#fff" />
                  </View>
                ) : (
                  <Button
                    width={32}
                    height={32}
                    circular
                    icon={<Trash size={20} color="#666" />}
                    onPress={removeFile}
                    backgroundColor="transparent"
                    hoverStyle={{ backgroundColor: '#F5F5F5' }}
                    enterStyle={{ opacity: 0, scale: 0.8 }}
                    exitStyle={{ opacity: 0, scale: 0.8 }}
                  />
                )}
              </AnimatePresence>
            </XStack>
          </XStack>

          {/* Progress Bar */}
          <AnimatePresence>
            {(uploading || progress === 100) && (
              <XStack
                width="100%"
                alignItems="baseline"
                marginTop={12}
                gap={8}
                enterStyle={{ opacity: 0, y: -10 }}
                exitStyle={{ opacity: 0, y: -10 }}>
                <XStack
                  width="88.5%"
                  position="relative"
                  height={8}
                  backgroundColor="#F0F0F0"
                  borderRadius={4}
                  marginBottom={8}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: animatedProgressValue.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: animatedProgressValue.interpolate({
                          inputRange: [0, 100],
                          outputRange: ['#FF7816', '#50C878'],
                        }),
                      },
                    ]}
                  />
                </XStack>
                <XStack justifyContent="flex-end">
                  <Text style={styles.percentText}>{progress}%</Text>
                </XStack>
              </XStack>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {displayError && (
              <XStack
                gap={4}
                alignItems="center"
                backgroundColor="#FFE5E5"
                padding={8}
                borderRadius={4}
                width="100%"
                marginTop={8}
                enterStyle={{ opacity: 0, scale: 0.9 }}
                exitStyle={{ opacity: 0, scale: 0.9 }}>
                <Ionicons name="alert-circle" size={18} color="#FF0404" />
                <Text color="$red10" fontSize={12}>
                  {displayError}
                </Text>
              </XStack>
            )}
          </AnimatePresence>
        </Card>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 8,
    backgroundColor: '#108910',
    borderRadius: 4,
    shadowColor: '#108910',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  percentText: {
    fontWeight: '500',
    fontSize: 16,
    color: '#333',
  },
});

export default FileUploadCard;
