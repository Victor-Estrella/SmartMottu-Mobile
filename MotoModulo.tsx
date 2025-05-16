import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BotaoProps } from './Cadastro';
import Moto from "./Moto";
import MotoDetalhes from "./MotoDetalhes";
import { FormularioMoto } from "./MotoFormulario";
import { ListagemMoto } from "./MotoListagem";
import { MapaPatio } from './Mapa';
import Configuracoes from './Configuracoes';


const Tab = createBottomTabNavigator();

const MotoModulo = ({ SucessoLogout }: { SucessoLogout: () => void }): React.ReactElement => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);


  const gravar = ( setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => {
    const moto = { setor, id, modelo, unidade, status, placa, chassi };

    setListaMoto([...listaMoto, moto]);
  };

  const deslogar = () => {
    AsyncStorage.removeItem("LOGIN")
      .then(() => {
        console.log("Deslogando");
        SucessoLogout();
      })
      .catch(() => {
        console.log("Erro ao deslogar");
      });
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, alignItems: 'flex-end', backgroundColor: 'black', zIndex: 2 }}>
        <Botao title="Sair" onPress={deslogar} />
      </View>

      <View style={{ flex: 1, }}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="MotoFormulario" options={{
              title: 'Formulario',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="clipboard" size={screenProps.size} color={screenProps.color} />
              ),
            }}>
            {(navProps: any) => ( <FormularioMoto onGravar={gravar} SucessoLogout={SucessoLogout} {...navProps} /> )}
          </Tab.Screen>
          <Tab.Screen name="Mapa" options={{  
              title: 'Mapa',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="map" size={screenProps.size} color={screenProps.color} />
              ),
            }}>
            {(navProps: any) => ( <MapaPatio listaMoto={listaMoto} {...navProps} /> )}
          </Tab.Screen>
          <Tab.Screen name="Listagem" options={{
              title: 'Listagem',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="list" size={screenProps.size} color={screenProps.color} />
              ),
            }}>
            {({ navigation }: { navigation: any }) => ( <ListagemMoto listaMoto={listaMoto} navigation={navigation} />)}
          </Tab.Screen>
          {listaMoto.length > 0 ? (
            <Tab.Screen name="MotoDetalhes" options={{
                title: 'Detalhes',
                tabBarIcon: (screenProps: any): ReactNode => (
                  <Feather name="info" size={screenProps.size} color={screenProps.color} />
                ),
              }}>
              {(navProps: any) => <MotoDetalhes listaMoto={listaMoto} setListaMoto={setListaMoto}  {...navProps} />} 
            </Tab.Screen>
            ) : null
          }
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
  )
}

function Botao(props: BotaoProps) {
  return (
      <Pressable onPress={props.onPress} style={{ padding: 10, paddingHorizontal: 40 , backgroundColor: 'green', borderRadius: 10, marginTop: 20  }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Sair</Text>
      </Pressable>
  );
}

export { MotoModulo };

