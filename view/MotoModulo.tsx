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

const Tab = createBottomTabNavigator();

const MotoModulo = ({ SucessoLogout }: { SucessoLogout: () => void }): React.ReactElement => {
    const { theme } = useThemeGlobal();

    return (
        <MotoProvider>
            <View style={{ flex: 1 }}>
                <View style={{ padding: 10, alignItems: 'flex-end', backgroundColor: theme.background, zIndex: 2 }}>
                    <Botao title="Sair" onPress={() => {
                        AsyncStorage.removeItem("LOGIN")
                            .then(() => SucessoLogout())
                            .catch(() => console.log("Erro ao deslogar"));
                    }} />
                </View>
                <View style={{ flex: 1, }}>
                    <Tab.Navigator screenOptions={{ headerShown: false }}>
                        <Tab.Screen name="MotoFormulario" options={{
                            title: 'Formulario',
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <Feather name="clipboard" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <FormularioMoto SucessoLogout={SucessoLogout} {...navProps} /> )}
                        </Tab.Screen>
                        <Tab.Screen name="Mapa" options={{  
                            title: 'Mapa',
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <Feather name="map" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <MapaPatio {...navProps} /> )}
                        </Tab.Screen>
                        <Tab.Screen name="Moto Informações" options={{
                            title: 'Moto Informações',
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <AntDesign name="info-circle" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <MotoLista {...navProps} /> )}
                        </Tab.Screen>
                        <Tab.Screen name="Configurações" options={{
                            title: 'Configurações',
                            tabBarIcon: (screenProps: any): ReactNode => (
                                <Feather name="settings" size={screenProps.size} color={screenProps.color} />
                            ),
                        }}>
                            {(navProps: any) => ( <Configuracoes {...navProps} /> )}
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
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Sair</Text>
        </Pressable>
    );
}

export { MotoModulo };

