export const themes = {
  light: {
    bg: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    hover: 'hover:bg-gray-100',
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
    }
  },
  dark: {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-white',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    button: {
      primary: 'bg-blue-500 hover:bg-blue-600 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-white'
    }
  }
};

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = typeof themes.light;