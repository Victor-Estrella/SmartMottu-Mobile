import React, { useState } from 'react';
import { FontAwesome} from '@expo/vector-icons';
import { styles } from './estilos';
import { Login } from './LoginFormulario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ListaCadastro } from './Cadastro';
import { Cadastro } from './CadastroFormulario';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';


const {Navigator, Screen} = createBottomTabNavigator();

export default function Autenticacao({ SucessoLogin }: { SucessoLogin: () => void }) {
    const [cadastro, setCadastro] = useState<ListaCadastro[]>([]);

    const logar = (nome : string, senha: string) => { 
            const obj = {nome, senha};  
            const strLista = JSON.stringify(obj);
            AsyncStorage.setItem("LOGIN", strLista)
                .then(() =>{
                    console.log("Login realizado com sucesso");
                    SucessoLogin();
                })
                .catch(() =>{
                    console.log("Erro ao realizar login");
                });
    }


    const cadastrar = (nome : string, email:string, senha: string) => {
        const obj = {nome, email, senha};
        setCadastro([...cadastro, obj])
    }


    return (
        <View style={styles.container}>
            <Navigator>
                <Screen name='Cadastro' options={{
                    headerShown: false,
                    tabBarIcon: (screenProps: any) =>
                        <FontAwesome name='wpforms' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({ navigation }: { navigation: any }) => ( <Cadastro onCadastro={cadastrar} navigation={navigation} />)}
                </Screen>
                <Screen name='Login' options={{
                    headerShown: false,
                    tabBarIcon: (screenProps: any) => 
                        <FontAwesome name='motorcycle' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({navigation}:{navigation:any}) => ( <Login onLogin={logar} navigation={navigation} />)}
                </Screen> 
            </Navigator>
            <StatusBar style="auto" />
        </View>
    );
}