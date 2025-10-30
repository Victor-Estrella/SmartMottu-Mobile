import { AntDesign, Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { BotaoProps } from '../model/Botao';
import { FormularioMoto } from './MotoFormulario';
import { MapaPatio } from './Mapa';
import Configuracoes from './Configuracoes';
import { MotoProvider } from '../contexto/MotoContext';
import { useThemeGlobal } from '../styles/ThemeContext';
import MotoLista from './MotoLista';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const MotoModulo = ({ SucessoLogout }: { SucessoLogout: () => void }): React.ReactElement => {
    const { theme } = useThemeGlobal();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("TOKEN");
            await AsyncStorage.removeItem("email");
            SucessoLogout();
        } catch (e) {
            console.log("Erro ao deslogar", e);
        }
    };

    return (
        <MotoProvider>
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10, alignItems: 'flex-end', backgroundColor: theme.background, zIndex: 2 }}>
                    <Botao title={t('moto.module.logout')} onPress={handleLogout} />
                </View>
                <View style={{ flex: 1, }}>
                    <Tab.Navigator screenOptions={{ headerShown: false }}>
                        <Tab.Screen name="MotoFormulario" options={{
                            title: t('navigation.tabs.form'),
                            tabBarLabel: t('navigation.tabs.form'),
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <Feather name="clipboard" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <FormularioMoto SucessoLogout={SucessoLogout} {...navProps} /> )}
                        </Tab.Screen>
                        <Tab.Screen name="Mapa" options={{  
                            title: t('navigation.tabs.map'),
                            tabBarLabel: t('navigation.tabs.map'),
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <Feather name="map" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <MapaPatio {...navProps} /> )}
                        </Tab.Screen>
                        <Tab.Screen name="Moto Informações" options={{
                            title: t('navigation.tabs.info'),
                            tabBarLabel: t('navigation.tabs.info'),
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <AntDesign name="info-circle" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <MotoLista {...navProps} /> )}
                        </Tab.Screen>
                        <Tab.Screen name="Configurações" options={{
                            title: t('navigation.tabs.settings'),
                            tabBarLabel: t('navigation.tabs.settings'),
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <Feather name="settings" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <Configuracoes {...navProps} SucessoLogout={SucessoLogout} /> )}
                        </Tab.Screen>
                    </Tab.Navigator>
                </View>
            </View>
        </MotoProvider>
    )
}

function Botao(props: BotaoProps) {
    return (
        <Pressable onPress={props.onPress} style={{ padding: 10, paddingHorizontal: 40 , backgroundColor: 'green', borderRadius: 10  }}>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{props.title}</Text>
        </Pressable>
    );
}

export { MotoModulo };

