// PdfViewerScreen.tsx
import React from 'react';
import { Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';

type PdfViewerScreenProps = {
  route: {
    params: { url: string; title: string };
  };
};

export default function PdfViewerScreen({ route }: PdfViewerScreenProps) {
  const { url } = route.params;

  const source = { uri: url, cache: true };

  return (
    <Pdf
      source={source}
      style={{ flex: 1, width: Dimensions.get('window').width }}
      onLoadComplete={(pages) => console.log(`${pages} pages loaded`)}
      onError={(error) => console.log(error)}
    />
  );
}
