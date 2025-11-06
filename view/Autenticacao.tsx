import React from 'react';
import { FontAwesome} from '@expo/vector-icons';
import { styles } from '../styles/estilos';
import { Login } from './Login';
import { loginUsuario } from '../fetcher/loginFetcher';
import { Cadastro } from './Cadastro';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';


const {Navigator, Screen} = createBottomTabNavigator();

export default function Autenticacao({ SucessoLogin }: { SucessoLogin: () => void }) {
    const { t } = useTranslation();

    const logar = async (email: string, senha: string) => {
        try {
            await loginUsuario({ email, senha });
            SucessoLogin();
        } catch (err) {
            console.log("Erro ao realizar login", err);
        }
    };

    return (
        <View style={styles.container}>
            <Navigator>
                <Screen name='Cadastro' options={{
                    headerShown: false,
                    title: t('navigation.tabs.signup'),
                    tabBarLabel: t('navigation.tabs.signup'),
                    tabBarIcon: (screenProps: any) =>
                        <FontAwesome name='wpforms' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({ navigation } : { navigation: any }) => ( <Cadastro navigation={navigation} />)}
                </Screen>
                <Screen name='Login' options={{
                    headerShown: false,
                    title: t('navigation.tabs.login'),
                    tabBarLabel: t('navigation.tabs.login'),
                    tabBarIcon: (screenProps: any) => 
                        <FontAwesome name='motorcycle' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({ navigation } : { navigation:any }) => ( <Login onLogin={logar} navigation={navigation} />)}
                </Screen> 
            </Navigator>
            <StatusBar style="auto" />
        </View>
    );
}