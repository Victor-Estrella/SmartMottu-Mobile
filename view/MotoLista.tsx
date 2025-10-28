import React from 'react';
import { styles } from '../styles/estilos';
import { ListagemMoto } from './MotoListagem';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MotoDetalhes from './MotoDetalhes';


const {Navigator, Screen} = createStackNavigator();

export default function MotoLista() {

    return (
        <View style={styles.container}>
            <Navigator>
                <Screen name='MotoListagem' options={{headerShown: false}}>
                    {({navigation}:{navigation:any}) => ( <ListagemMoto navigation={navigation} />)}
                </Screen> 
                <Screen name='MotoDetalhes' options={{headerShown: false}}>
                    {({ navigation }: { navigation: any }) => ( <MotoDetalhes navigation={navigation} />)}
                </Screen>
            </Navigator>
            <StatusBar style="auto" />
        </View>
    );
}