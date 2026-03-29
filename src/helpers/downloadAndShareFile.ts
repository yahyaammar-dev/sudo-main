import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const downloadAndShareFile = async (fileUrl: string, fileName: string) => {
  try {
    const localPath = FileSystem.documentDirectory + fileName;

    const downloadRes = await FileSystem.downloadAsync(fileUrl, localPath);

    await Sharing.shareAsync(downloadRes.uri);
  } catch (error) {
    throw error;
  }
};
