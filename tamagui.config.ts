import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { createTamagui } from 'tamagui';

const headingFont = createInterFont();
const bodyFont = createInterFont();

const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes,
  tokens,
  shorthands,
});

export type Conf = typeof config;

// Make type available to Tamagui
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
