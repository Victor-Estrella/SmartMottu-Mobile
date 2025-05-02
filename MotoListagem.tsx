import Moto from "./Moto"
import { FlatList, Pressable, Text, View } from "react-native"
import { BotaoProps } from "./Cadastro"
import { styles } from "./estilos"

interface MotoPropsExtra {
  item: Moto;
  navigation: any;
}



const MotoProps = ({ item, navigation }: MotoPropsExtra): React.ReactElement => {
  
  return (
    <View style={{flex:1, alignItems:'center'}}>
      <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 12, padding: 12, marginTop: 12}}>
        <Text>Setor: {item.setor}</Text>
        <Text>Id: {item.id}</Text>
        <Text>Modelo: {item.modelo}</Text>
        <Botao title="Ver mais detalhes" onPress={() => {
          navigation.navigate("MotoDetalhes", { moto: item});
        }}/>
      </View>
    </View>
  );
};

function Botao( props : BotaoProps ) { 
  return (
    <Pressable onPress={props.onPress}>
      <View style={{borderRadius: 16, marginTop: 12, backgroundColor: 'black', alignItems:'center'}} >
        <Text style={styles.buttonText}>
          {props.title}
        </Text>
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
    <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize:22, fontWeight: 'bold', marginTop: 32}}>Listagem de Motos</Text>
      <FlatList data={listaMoto} keyExtractor={(item) => item.id.toString()} renderItem={({ item }) => (<MotoProps item={item} navigation={navigation} />)}/>
    </View>
  );
};

export {ListagemMoto};
  