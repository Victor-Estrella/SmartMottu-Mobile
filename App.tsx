import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { styles } from './styles/estilos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { MotoModulo } from './view/MotoModulo';
import Autenticacao from './view/Autenticacao';


const {Navigator, Screen} = createStackNavigator();

export default function App() {
  const [login, setLogin] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem("LOGIN").then((data) => {
      if (data) setLogin(true);
    });
  }, []);

  return (
    <NavigationContainer>
      <View style={styles.container}>
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
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}