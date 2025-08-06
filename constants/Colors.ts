/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#3B82F6';
const tintColorDark = '#93C5FD';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F9FAFB',
    tint: tintColorLight,
    icon: '#111827',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F9FAFB',
    background: '#1F2937',
    tint: tintColorDark,
    icon: '#F9FAFB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
  },
};
