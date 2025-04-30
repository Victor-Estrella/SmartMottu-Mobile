import React, { useState } from 'react';
import { FontAwesome} from '@expo/vector-icons';
import { styles } from './estilos';
import { Login } from './LoginFormulario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListaCadastro, ListaLogin } from './Cadastro';
import { Cadastro } from './CadastroFormulario';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';


const {Navigator, Screen} = createBottomTabNavigator();

export default function Autenticacao() {
    const [cadastro, setCadastro] = useState<ListaCadastro[]>([]);
    const [login, setLogin] = useState<boolean>(false);

    const logar = (nome : string, senha: string) => { 
            const obj = {nome, senha};
            const strLista = JSON.stringify(obj);
            AsyncStorage.setItem("LOGIN", strLista)
                .then(() =>{console.log("Login realizado com sucesso");})
                .catch(() =>{console.log("Erro ao realizar login");});
            setLogin(true);
    }


    const cadastrar = (nome : string, email:string, senha: string) => {
        const obj = {nome, email, senha};
        setCadastro([...cadastro, obj])
    }


    return (
        <View style={styles.container}>
            <Navigator>
                <Screen name='Cadastro'component={({ navigation }: { navigation: any }) => (
                    <Cadastro onCadastro={cadastrar} navigation={navigation} />)} options={{
                        title: "Cadastro",
                        tabBarIcon: (screenProps: any) =>
                        <FontAwesome name='wpforms' size={screenProps.size} color={screenProps.color}/>
                    }}
                />
                <Screen name='Login' component={({navigation}:{navigation:any}) => (
                    <Login onLogin={logar} navigation={navigation} />)} options={{
                        title: "Login",
                        tabBarIcon: (screenProps: any) => 
                        <FontAwesome name='motorcycle' size={screenProps.size} color={screenProps.color}/>
                    }} 
                /> 
            </Navigator>
            <StatusBar style="auto" />
        </View>
    );
}