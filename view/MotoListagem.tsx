import { Moto } from "../model/Moto";
import { FlatList, Pressable, Text, View } from "react-native";
import { BotaoProps } from "../model/Botao";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { styles } from "../styles/estilos";

interface MotoPropsExtra {
  item: Moto;
  navigation: NavigationProp<ParamListBase>;
}

const MotoProps = ({ item, navigation }: MotoPropsExtra): React.ReactElement => {
  return (
    <View style={styles.linhaTabela}>
      <Text style={styles.objetosTabela}>{item.setor}</Text>
      <Text style={styles.objetosTabela}>{item.idMoto}</Text>
      <Text style={styles.objetosTabela}>{item.modelo}</Text>
      <Botao title="Detalhes" onPress={() => navigation.navigate("MotoDetalhes", { moto: item })} />
    </View>
  );
};

function Botao(props: BotaoProps) {
  return (
    <Pressable onPress={props.onPress} style={styles.pressableDetalhesTabela}>
      <View style={styles.botaoDetalhes}>
        <Text style={styles.botaoTextoDetalhes}>{props.title}</Text>
      </View>
    </Pressable>
  );
}

import { useMotoControl } from '../control/motoControl';

const ListagemMoto = ({ navigation }: { navigation: any }): React.ReactElement => {
  const { listaMoto } = useMotoControl();
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <Text style={styles.tituloTabela}>Listagem de Motos</Text>
      <View style={styles.cabecalhoTabela}>
        <Text style={styles.cabecalhoTextoTabela}>Setor</Text>
        <Text style={styles.cabecalhoTextoTabela}>Id</Text>
        <Text style={styles.cabecalhoTextoTabela}>Modelo</Text>
        <Text style={styles.cabecalhoTextoTabela}>Ação</Text>
      </View>
      <FlatList
        style={styles.tabelaContainer}
        data={listaMoto}
        renderItem={({ item }) => <MotoProps item={item} navigation={navigation} />}
        ListEmptyComponent={<Text style={{color: 'white', textAlign: 'center', marginTop: 20}}>Nenhuma moto cadastrada.</Text>}
      />
    </View>
  );
};


export { ListagemMoto };
