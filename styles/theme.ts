import { useColorScheme } from 'react-native';

export const lightTheme = {
  background: '#f5f5f5', // fundo geral das telas de motos
  primary: '#00b131',
  text: '#222',          // texto geral das telas de motos
  secondary: '#e0e0e0',  // fundo de inputs/cards nas telas de motos
  border: '#ccc',
  card: '#fff',
  button: 'green',
  buttonText: '#fff',
  // Específicos para login/cadastro
  formBackground: '#f5f5f5',
  formText: '#222',
  formInputBackground: '#e0e0e0',

  //Mapa
  outro: '#000',
  mapaTexto: "#c1c1c1ff",
};

export const darkTheme = {
  background: '#181818',
  text: '#eee',
  primary: '#00b131',
  secondary: '#232323',
  border: '#333',
  card: '#232323',
  button: 'green',
  buttonText: '#fff',

  
  // Específicos para login/cadastro
  formBackground: '#181818',
  formText: '#fff',
  formInputBackground: '#333',

  //Mapa
  outro: '#fff',
  mapaTexto: "#000",
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
