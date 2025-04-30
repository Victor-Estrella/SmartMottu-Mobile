import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { FontAwesome} from '@expo/vector-icons';
import { styles } from './estilos';
import { Login } from './LoginFormulario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListaCadastro, ListaLogin } from './Cadastro';
import { Cadastro } from './CadastroFormulario';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MotoModulo } from './MotoModulo';
import Autenticacao from './Autenticacao';


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
        {login ? (
          <Screen name="Auth" component={Autenticacao}/>
        ) : (
          <Screen name="MotoModulo" component={MotoModulo} />
        )}
      </Navigator>
      <StatusBar style="auto" />
    </View>
  </NavigationContainer>
  );
}