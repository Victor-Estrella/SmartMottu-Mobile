import React from 'react';
import { FontAwesome} from '@expo/vector-icons';
import { styles } from '../styles/estilos';
import { Login } from './LoginFormulario';
import { useCadastroControl } from '../control/cadastroControl';
import { loginUsuario } from '../fetcher/cadastroFetcher';
import { Cadastro } from './Cadastro';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';


const {Navigator, Screen} = createBottomTabNavigator();

export default function Autenticacao({ SucessoLogin }: { SucessoLogin: () => void }) {
    const { salvar, loading, mensagem } = useCadastroControl();

    const logar = async (nome: string, senha: string) => {
        try {
            await loginUsuario({ nome, senha });
            SucessoLogin();
        } catch (err) {
            console.log("Erro ao realizar login", err);
        }
    };

    const cadastrar = async (nome: string, email: string, senha: string) => {
        await salvar(nome, email, senha);
    };

    return (
        <View style={styles.container}>
            <Navigator>
                <Screen name='Cadastro' options={{
                    headerShown: false,
                    tabBarIcon: (screenProps: any) =>
                        <FontAwesome name='wpforms' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({ navigation }: { navigation: any }) => ( <Cadastro navigation={navigation} />)}
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