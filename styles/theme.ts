import { useColorScheme } from 'react-native';

export const lightTheme = {
  background: '#fff',
  text: '#000',
  primary: '#00b131',
  secondary: '#333',
  border: '#ccc',
  card: '#eee',
  button: 'green',
  buttonText: '#fff',
};

export const darkTheme = {
  background: '#000',
  text: '#fff',
  primary: '#00b131',
  secondary: '#fff',
  border: '#ccc',
  card: '#333',
  button: 'green',
  buttonText: '#fff',
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
