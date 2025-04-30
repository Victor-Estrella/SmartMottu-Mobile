import { View } from "react-native";
import { FormularioMoto } from "./MotoFormulario";
import { ListagemMoto } from "./MotoListagem";
import Moto from "./Moto";
import { ReactNode, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Feather} from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";


const Tab = createBottomTabNavigator();

const MotoModulo = () : React.ReactElement => {
    const [listaMoto, setListaMoto] = useState<Moto[]>([]);
  
    const gravar = (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => { 
      const moto = { setor, id, modelo, unidade, status, placa, chassi };
  
      const novaLista = [ ...listaMoto, moto ];
      setListaMoto( novaLista );
    }
    return (
        <View style={{  flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
          <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="MotoFormulario" component={(navProps: any) => (
              <FormularioMoto onGravar={gravar}  {...navProps}/> ) } options={{
                title: 'Formulario',
                tabBarIcon: (screenProps: any) : ReactNode => {
                  return (
                    <Feather name="clipboard" size={screenProps.size} color={screenProps.color}  />
                  )
                }
              }}/>
    
            <Tab.Screen name="Listagem" component={(navProps: any) => (
              <ListagemMoto listaMoto={listaMoto}  {...navProps}/> ) } options={{
                title: 'Listagem',
                tabBarIcon: (screenProps: any) : ReactNode => {
                  return (
                    <Feather name="list" size={screenProps.size} color={screenProps.color}  />
                  )
                }
              }}/>
          </Tab.Navigator>
        </View>
    )
  }
export {MotoModulo};