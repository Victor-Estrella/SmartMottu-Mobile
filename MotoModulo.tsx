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


const Tab = createBottomTabNavigator();

const MotoModulo = ({ SucessoLogout }: { SucessoLogout: () => void }): React.ReactElement => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);

  const calcularProximaPosicao = (index: number): { posX: number, posY: number } => {
    const espacamentoX = 60;
    const espacamentoY = 60;
    const colunas = 5;

    const coluna = index % colunas;
    const linha = Math.floor(index / colunas);

    return {
      posX: coluna * espacamentoX + 10,
      posY: linha * espacamentoY + 10,
    };
  };


  const gravar = ( setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => {
    const novaPosicao = calcularProximaPosicao(listaMoto.length);
    const moto = { setor, id, modelo, unidade, status, placa, chassi, posX: novaPosicao.posX, posY: novaPosicao.posY };

    const novaLista = [...listaMoto, moto];
    setListaMoto(novaLista);
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
          <Tab.Screen name="MotoFormulario" component={(navProps: any) => ( <FormularioMoto onGravar={gravar} SucessoLogout={SucessoLogout} {...navProps} /> )} options={{
              title: 'Formulario',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="clipboard" size={screenProps.size} color={screenProps.color} />
              ),
            }}/>
          <Tab.Screen name="Mapa" component={(navProps: any) => ( <MapaPatio listaMoto={listaMoto} {...navProps} /> )} options={{
              title: 'Mapa',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="map" size={screenProps.size} color={screenProps.color} />
              ),
            }} />
          <Tab.Screen name="Listagem" component={({ navigation }: { navigation: any }) => ( <ListagemMoto listaMoto={listaMoto} navigation={navigation} />)} options={{
              title: 'Listagem',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="list" size={screenProps.size} color={screenProps.color} />
              ),
            }}
          />
          {listaMoto.length > 0 ? (
            <Tab.Screen name="MotoDetalhes" component={(navProps: any) => <MotoDetalhes {...navProps} />} options={{
                title: 'Detalhes',
                tabBarIcon: (screenProps: any): ReactNode => (
                  <Feather name="info" size={screenProps.size} color={screenProps.color} />
                ),
              }} />
            ) : null
          }
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

