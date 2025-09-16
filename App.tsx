import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { styles } from './styles/estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { MotoModulo } from './view/MotoModulo';
import Autenticacao from './view/Autenticacao';
import { ThemeProvider, useThemeGlobal } from './styles/ThemeContext';

const {Navigator, Screen} = createStackNavigator();

export default function App() {
  const [login, setLogin] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem("TOKEN").then((data) => {
      if (data) setLogin(true);
    });
  }, []);

  return (
    <ThemeProvider>
      <AppWithTheme login={login} setLogin={setLogin} />
    </ThemeProvider>
  );
}


function AppWithTheme({ login, setLogin }: { login: boolean, setLogin: (v: boolean) => void }) {
  const { theme, toggleTheme, isDark } = useThemeGlobal();
  return (
    <NavigationContainer>
      <View style={[styles.container, { backgroundColor: theme.background }]}> 
        <View style={{ alignItems: 'flex-end', padding: 8 }}>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <ThemeSwitch onPress={toggleTheme} isDark={isDark} />
        </View>
        <Navigator screenOptions={{ headerShown: false }}>
          {!login ? (
            <Screen name="Autenticacao"> 
            {(navProps) => <Autenticacao {...navProps} SucessoLogin={() => setLogin(true)} />} 
            </Screen>
          ) : (
            <Screen name="MotoModulo"> 
            {(navProps) => <MotoModulo {...navProps} SucessoLogout={() => setLogin(false)} />} 
            </Screen>
          )}
        </Navigator>
      </View>
    </NavigationContainer>
  );
}

function ThemeSwitch({ onPress, isDark }: { onPress: () => void, isDark: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ padding: 8, borderRadius: 20, backgroundColor: isDark ? '#222' : '#eee', marginRight: 8, marginTop: 30 }}>
      <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: 'bold' }}>{isDark ? '🌙 Escuro' : '☀️ Claro'}</Text>
    </Pressable>
  );
}