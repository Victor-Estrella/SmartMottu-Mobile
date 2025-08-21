import { Moto } from "../model/Moto";
import { FlatList, Pressable, Text, View, ScrollView } from "react-native";
import { BotaoProps } from "../model/Botao";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { styles } from "../estilos";

interface MotoPropsExtra {
  item: Moto;
  navigation: NavigationProp<ParamListBase>;
}

const MotoProps = ({ item, navigation }: MotoPropsExtra): React.ReactElement => {
  return (
    <View style={styles.linhaTabela}>
      <Text style={styles.objetosTabela}>{item.setor}</Text>
      <Text style={styles.objetosTabela}>{item.id}</Text>
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

interface ListagemProps {
  listaMoto: Moto[];
  navigation: any;
}

const ListagemMoto = ({ listaMoto, navigation }: ListagemProps): React.ReactElement => {
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <ScrollView style={styles.tabelaContainer}>
        <Text style={styles.tituloTabela}>Listagem de Motos</Text>
        <View style={styles.cabecalhoTabela}>
          <Text style={styles.cabecalhoTextoTabela}>Setor</Text>
          <Text style={styles.cabecalhoTextoTabela}>Id</Text>
          <Text style={styles.cabecalhoTextoTabela}>Modelo</Text>
          <Text style={styles.cabecalhoTextoTabela}>Ação</Text>
        </View>
        <FlatList data={listaMoto} renderItem={({ item }) => <MotoProps item={item} navigation={navigation} />} keyExtractor={(item) => item.id.toString()} />
      </ScrollView>
    </View>
  );
};


export { ListagemMoto };
