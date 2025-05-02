  import { ParamListBase } from "@react-navigation/native"
  import { useState } from "react"
  import { Pressable, Text, TextInput, View } from "react-native"
  import { styles } from "./estilos"
import { BotaoProps } from "./Cadastro"

  interface MotoFormularioProps extends ParamListBase {
      onGravar : (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => void
    }
    
    const FormularioMoto = (props: MotoFormularioProps) : React.ReactElement => {
      const [setor, setSetor] = useState("")
      const [modelo, setModelo] = useState("")
      const [unidade, setUnidade] = useState("")
      const [status, setStatus] = useState("")
      const [placa, setPlaca] = useState("")
      const [chassi, setChassi] = useState("")
      const [id, setId] = useState("")
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize:22, fontWeight: 'bold', marginTop: 32}}>Formulario de Cadastro da Moto</Text>
          <View style={{flex: 1}}>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Setor:</Text>
              <TextInput value={setor} onChangeText={setSetor} style={styles.input}/>
            </View>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Id:</Text>
              <TextInput value={id} onChangeText={setId} style={styles.input}/>
            </View>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Modelo:</Text>
              <TextInput value={modelo} onChangeText={setModelo} style={styles.input}/>
            </View>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Unidade:</Text>
              <TextInput value={unidade} onChangeText={setUnidade} style={styles.input}/>
            </View>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Status:</Text>
              <TextInput value={status} onChangeText={setStatus} style={styles.input}/>
            </View>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Placa:</Text>
              <TextInput value={placa} onChangeText={setPlaca} style={styles.input}/>
            </View>
            <View style={styles.viewInput}>
              <Text style={{marginRight: 32}}>Chassi:</Text>
              <TextInput value={chassi} onChangeText={setChassi} style={styles.input}/>
            </View>
            <View>
              <Botao title="Gravar" onPress={() => 
                props.onGravar(setor, id, modelo, unidade, status, placa, chassi)} 
                
              />
            </View>
          </View>
        </View>
      )
  }

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

  export {FormularioMoto};