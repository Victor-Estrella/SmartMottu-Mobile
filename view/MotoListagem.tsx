import { Moto } from "../model/Moto";
import { FlatList, Pressable, Text, View } from "react-native";
import { BotaoProps } from "../model/Botao";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { styles } from "../styles/estilos";
import { useMoto } from '../control/MotoContext';
import { useTheme } from '../styles/theme';

interface MotoPropsExtra {
  item: Moto;
  navigation: NavigationProp<ParamListBase>;
}

const MotoProps = ({ item, navigation }: MotoPropsExtra): React.ReactElement => {
  const theme = useTheme();
  return (
    <View style={[styles.linhaTabela, {backgroundColor: theme.card}]}> 
      <Text style={[styles.objetosTabela, {color: theme.text}]}>{item.setor}</Text>
      <Text style={[styles.objetosTabela, {color: theme.text}]}>{item.idMoto}</Text>
      <Text style={[styles.objetosTabela, {color: theme.text}]}>{item.modelo}</Text>
      {/* Passa apenas o idMoto para a tela de detalhes */}
      <Botao title="Detalhes" onPress={() => navigation.navigate("MotoDetalhes", { idMoto: item.idMoto })} />
    </View>
  );
};

const ListagemMoto = ({ navigation }: { navigation: any }): React.ReactElement => {
  const { listaMoto } = useMoto();
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <Text style={[styles.tituloTabela, {color: theme.primary}]}>Listagem de Motos</Text>
      <View style={[styles.cabecalhoTabela, {backgroundColor: theme.card}]}> 
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>Setor</Text>
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>Id</Text>
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>Modelo</Text>
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>Ação</Text>
      </View>
      <FlatList
        style={styles.tabelaContainer}
        data={listaMoto}
        renderItem={({ item }) => <MotoProps item={item} navigation={navigation} />}
        keyExtractor={item => String(item.idMoto ?? item.nmChassi ?? Math.random())}
        ListEmptyComponent={<Text style={{color: theme.text, textAlign: 'center', marginTop: 20}}>Nenhuma moto cadastrada.</Text>}
      />
    </View>
  );
};

function Botao(props: BotaoProps) {
  const theme = useTheme();
  return (
    <Pressable onPress={props.onPress} style={styles.pressableDetalhesTabela}>
      <View style={[styles.botaoDetalhes, {backgroundColor: theme.button}]}> 
        <Text style={[styles.botaoTextoDetalhes, {color: theme.buttonText}]}>{props.title}</Text>
      </View>
    </Pressable>
  );
}

export { ListagemMoto };
