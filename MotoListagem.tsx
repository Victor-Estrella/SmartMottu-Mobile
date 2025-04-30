import { ParamListBase } from "@react-navigation/native"
import Moto from "./Moto"
import { Button, FlatList, ListRenderItemInfo, Text, View } from "react-native"


const MotoProps = (props:ListRenderItemInfo<Moto>) : React.ReactElement => {
    return(
      <View style={{flex:1, alignItems:'center'}}>
        <View style={{borderWidth: 1, borderColor: 'black', borderRadius: 12, padding: 12, marginTop: 12}}>
          <Text>Setor: {props.item.setor}</Text>
          <Text>Id: {props.item.id}</Text>
          <Text>Modelo: {props.item.modelo}</Text>
          <Button title="Ver mais detalhes" color="black" onPress={() => {}}/>
        </View>
      </View>
    )
  } 

interface ListagemProps extends ParamListBase {
    listaMoto: Moto[]
  }
  
  const ListagemMoto = (props: ListagemProps) : React.ReactElement => {
    return(
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize:22, fontWeight: 'bold', marginTop: 32}}>Listagem de Motos</Text>
        <FlatList data={props.listaMoto} renderItem={MotoProps}/>
      </View>
    ) 
}

export {ListagemMoto};
  