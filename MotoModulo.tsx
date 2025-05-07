import { Button, View } from "react-native";
import { FormularioMoto } from "./MotoFormulario";
import { ListagemMoto } from "./MotoListagem";
import Moto from "./Moto";
import { ReactNode, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Feather} from '@expo/vector-icons';
import MotoDetalhes from "./MotoDetalhes";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Tab = createBottomTabNavigator();

const MotoModulo = ({ onLogout }: { onLogout: () => void }) : React.ReactElement => {
    const [listaMoto, setListaMoto] = useState<Moto[]>([]);
  
    const gravar = (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => { 
      const moto = { setor, id, modelo, unidade, status, placa, chassi };
  
      const novaLista = [ ...listaMoto, moto ];
      setListaMoto( novaLista );
    }

    const deslogar = () => { 
      AsyncStorage.removeItem("LOGIN")
          .then(() =>{
              console.log("Deslogando");
              onLogout();
          })
          .catch(() =>{
              console.log("Erro ao deslogar");
          });
}

    return (
        <View style={{  flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
          <Button title="Sair" onPress={deslogar} />
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
    
            <Tab.Screen name="Listagem" component={({navigation}: {navigation: any}) => (
              <ListagemMoto listaMoto={listaMoto} navigation={navigation} /> ) } options={{
                title: 'Listagem',
                tabBarIcon: (screenProps: any) : ReactNode => {
                  return (
                    <Feather name="list" size={screenProps.size} color={screenProps.color}  />
                  )
                }
              }}/>
              {listaMoto.length > 0 ? (
                <Tab.Screen name="MotoDetalhes" component={(navProps: any) => (
                  <MotoDetalhes {...navProps} /> ) } options={{
                    title: 'Detalhes',
                    tabBarIcon: (screenProps: any) : ReactNode => {
                      return (
                        <Feather name="info" size={screenProps.size} color={screenProps.color}  />
                      )
                    }
                  }}/>
                ) : null
              }
          </Tab.Navigator>
        </View>
    )
  }
export {MotoModulo};