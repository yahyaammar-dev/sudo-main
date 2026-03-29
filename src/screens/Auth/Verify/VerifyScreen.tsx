import { use$ } from '@legendapp/state/react';
import { useVerifyOtp } from 'api/mutations';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'hooks';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { useRef, useState, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { Routes } from 'routers';
import { userStore } from 'store';
import { YStack, XStack, Button, ButtonText, View, Text, Image } from 'tamagui';

import Logo from '../../../../assets/logo.png';

const CODE_LENGTH = 4;
const RESEND_TIME = 20;

function VerifyScreen() {
  const { from } = useLocalSearchParams();
  const { translations } = useTranslation();
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(RESEND_TIME);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<RNTextInput>(null);
  const { userInfo, login, setAccount } = use$(userStore);
  const { mutate: verifyOtp } = useVerifyOtp({
    onSuccess: (data) => {
      setIsVerifying(false);
      if (data.success) {
        setAccount(data.user);
        login(userInfo, data.token);
        if (from === 'signup') {
          router.replace(Routes.ThankYou);
        } else {
          router.replace(Routes.Home);
        }
      } else {
        setError(translations.wrongOtp);
      }
    },
    onError: () => {
      setIsVerifying(false);
      setError(translations.wrongOtp);
    },
  });

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handlePasteOTP = async () => {
    try {
      const clipboardContent = await Clipboard.getString();

      const otpPatterns = [/\b\d{4}\b/, /\d{4}/, /[0-9]{4}/];

      let foundOTP = null;

      for (const pattern of otpPatterns) {
        const match = clipboardContent.match(pattern);
        if (match) {
          foundOTP = match[0];
          break;
        }
      }

      if (foundOTP) {
        const cleanOTP = foundOTP.replace(/\D/g, '');

        if (cleanOTP.length === 4) {
          handleCodeChange(cleanOTP);
        }
      }
    } catch (error) {}
  };

  const handleCodeChange = (value: string) => {
    if (value.length <= CODE_LENGTH && /^\d*$/.test(value)) {
      setCode(value);
      setError('');
      setActiveIndex(value.length < CODE_LENGTH ? value.length : CODE_LENGTH - 1);
      if (value.length === CODE_LENGTH && !isVerifying) {
        if (!userInfo?.toPhoneNumber) return;
        setIsVerifying(true);
        verifyOtp({
          otp: Number(value),
          toPhoneNumber: userInfo?.toPhoneNumber,
        });
      }
    }
  };

  const handleEditDigit = (index: number) => {
    setActiveIndex(index);

    handlePasteOTP();

    if (code.length > index) {
      inputRef.current?.focus();

      if (index < code.length - 1) {
        const newCode = code.substring(0, index);
        setCode(newCode);
      }
    } else {
      inputRef.current?.focus();
    }
  };

  const handleResend = () => {
    setTimer(RESEND_TIME);
    setError('');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <YStack f={1} bg="#fff" px={24}>
          <XStack jc="space-between" ai="center" mb={32} mt={24}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft2 color="#000" size={24} />
            </TouchableOpacity>
            <Image source={Logo} alt="Logo" width={52} height={52} />
          </XStack>

          <Text fontSize={28} fontWeight="bold" mb={12}>
            {translations.enterCode}
          </Text>
          <Text fontSize={16} color="#444" mb={32}>
            {translations.enterCodeDescription}{' '}
            <Text fontWeight="bold" color="#222">
              {`+${userInfo?.country}${userInfo?.phoneNumber}`}
            </Text>
          </Text>

          {error ? (
            <Text color="#FF3B30" fontSize={14} mb={12} textAlign="center">
              {error}
            </Text>
          ) : null}

          <XStack jc="center" mb={32} gap={9} pos="relative">
            {[...Array(CODE_LENGTH)].map((_, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleEditDigit(idx)}>
                <YStack
                  w={48}
                  h={56}
                  br={12}
                  bw={1}
                  boc={activeIndex === idx ? '#222' : '#ccc'}
                  mx={4}
                  jc="center"
                  ai="center"
                  bg="#fafafa"
                  opacity={isVerifying ? 0.6 : 1}>
                  {isVerifying && idx === CODE_LENGTH - 1 ? (
                    <ActivityIndicator size="small" color="#222" />
                  ) : (
                    <Text fontSize={28} fontWeight="bold" color="#222">
                      {code[idx] || ''}
                    </Text>
                  )}
                </YStack>
              </TouchableOpacity>
            ))}
            <RNTextInput
              ref={inputRef}
              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0 }}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              maxLength={CODE_LENGTH}
              autoFocus
              selection={
                code.length === CODE_LENGTH
                  ? { start: activeIndex, end: activeIndex + 1 }
                  : undefined
              }
            />
          </XStack>

          <View f={1} />

          <YStack mb={32}>
            <XStack jc="center" ai="center" gap={8}>
              <Button
                chromeless
                onPress={handleResend}
                disabled={timer > 0}
                px={0}
                py={0}
                minWidth={0}
                minHeight={0}
                alignSelf="center">
                <ButtonText fontWeight="bold" fontSize={16} color={timer > 0 ? '#888' : '#108910'}>
                  {translations.sendCodeAgain}
                </ButtonText>
              </Button>
              <Text color="#888" fontSize={16}>
                00:{timer.toString().padStart(2, '0')}
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default VerifyScreen;
