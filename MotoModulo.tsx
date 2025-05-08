import { Feather } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ReactNode, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BotaoProps } from './Cadastro';
import { styles } from './estilos';
import Moto from "./Moto";
import MotoDetalhes from "./MotoDetalhes";
import { FormularioMoto } from "./MotoFormulario";
import { ListagemMoto } from "./MotoListagem";


const Tab = createBottomTabNavigator();

const MotoModulo = ({ SucessoLogout }: { SucessoLogout: () => void }): React.ReactElement => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);

  const gravar = (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => {
    const moto = { setor, id, modelo, unidade, status, placa, chassi };

    const novaLista = [...listaMoto, moto];
    setListaMoto(novaLista);
  }

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
      {/* Botão de logout fixo no topo direito */}
      <View style={{ padding: 10, alignItems: 'flex-end', backgroundColor: 'black', zIndex: 2 }}>
        <Pressable onPress={deslogar} style={{ padding: 10, backgroundColor: 'red', borderRadius: 10, marginTop: 20  }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Sair</Text>
        </Pressable>
      </View>

      {/* Abas abaixo do botão */}
      <View style={{ flex: 1, }}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="MotoFormulario" component={(navProps: any) => ( <FormularioMoto onGravar={gravar} SucessoLogout={SucessoLogout} {...navProps} /> )} options={{
              title: 'Formulario',
              tabBarIcon: (screenProps: any): ReactNode => (
                <Feather name="clipboard" size={screenProps.size} color={screenProps.color} />
              ),
            }}/>
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
    <Pressable onPress={props.onPress} style={{ padding: 10, backgroundColor: 'red', borderRadius: 10 }}>
      <View style={{ borderRadius: 16, backgroundColor: 'green', position: 'absolute' }}>
        <Text style={{ color: 'white', fontWeight: 'bold'}}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  );
}

export { MotoModulo };

