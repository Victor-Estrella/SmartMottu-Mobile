import React from 'react';
import { FontAwesome} from '@expo/vector-icons';
import { styles } from '../styles/estilos';
import { ListagemMoto } from './MotoListagem';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MotoDetalhes from './MotoDetalhes';


const {Navigator, Screen} = createBottomTabNavigator();

export default function MotoLista() {

    return (
        <View style={styles.container}>
            <Navigator>
                <Screen name='MotoDetalhes' options={{
                    headerShown: false,
                    tabBarIcon: (screenProps: any) =>
                        <FontAwesome name='wpforms' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({ navigation }: { navigation: any }) => ( <MotoDetalhes navigation={navigation} />)}
                </Screen>
                <Screen name='MotoLista' options={{
                    headerShown: false,
                    tabBarIcon: (screenProps: any) => 
                        <FontAwesome name='motorcycle' size={screenProps.size} color={screenProps.color}/>
                    }}>
                    {({navigation}:{navigation:any}) => ( <ListagemMoto navigation={navigation} />)}
                </Screen> 
            </Navigator>
            <StatusBar style="auto" />
        </View>
    );
}