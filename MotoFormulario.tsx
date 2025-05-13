import { ParamListBase } from "@react-navigation/native"
import { useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { BotaoProps } from "./Cadastro"
import { styles } from "./estilos"
import { ScrollView } from "react-native-gesture-handler"
import { Picker, PickerIOS } from "@react-native-picker/picker"

interface MotoFormularioProps extends ParamListBase {
  onGravar : (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => void
}

const FormularioMoto = (props: MotoFormularioProps) : React.ReactElement => {
  const [setorSelecionado, setSetorSelecionado] = useState("pendencia")
  const [modelo, setModelo] = useState("")
  const [unidade, setUnidade] = useState("")
  const [status, setStatus] = useState("")
  const [placa, setPlaca] = useState("")
  const [chassi, setChassi] = useState("")
  const [id, setId] = useState("")

  return (
    <ScrollView contentContainerStyle={{minHeight: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black'}}>
      <Text style={styles.tituloFormulario}>Formulario de Cadastro da Moto</Text>
      <View style={{ width: '70%',  backgroundColor: 'black'}}>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Setor</Text>
          <Picker style={styles.input} selectedValue={setorSelecionado} onValueChange={(itemValue, itemIndex) => setSetorSelecionado(itemValue)}>
            <Picker.Item label="Pendência" value="Pendencia" />
            <Picker.Item label="Reparo Simples" value="Reparo Simples" />
            <Picker.Item label="Danos Estruturais Graves" value="Danos Estruturais Graves" />
            <Picker.Item label="Motor Defeituoso" value="Motor Defeituoso" />
            <Picker.Item label="Agendada para Manutenção" value="Agendada Para Manutencao" />
            <Picker.Item label="Pronta para Aluguel" value="Pronta Para Aluguel" />
            <Picker.Item label="Sem Placa" value="Sem Placa" />
            <Picker.Item label="Minha Mottu" value="Minha Mottu" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Id</Text>
          <TextInput value={id} onChangeText={setId} style={styles.input} placeholderTextColor="white"/>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Modelo</Text>
          <TextInput value={modelo} onChangeText={setModelo} style={styles.input} placeholderTextColor="white"/>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Unidade</Text>
          <TextInput value={unidade} onChangeText={setUnidade} style={styles.input} placeholderTextColor="white"/>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Status</Text>
          <TextInput value={status} onChangeText={setStatus} style={styles.input} placeholderTextColor="white"/>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Placa</Text>
          <TextInput value={placa} onChangeText={setPlaca} style={styles.input} placeholderTextColor="white"/>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Chassi</Text>
          <TextInput value={chassi} onChangeText={setChassi} style={styles.input} placeholderTextColor="white"/>
        </View>
        <View style={{alignItems: 'center'}}>
          <Botao title="Gravar" onPress={() => 
          props.onGravar(setorSelecionado, id, modelo, unidade, status, placa, chassi)}/>
        </View>
      </View>
    </ScrollView>
  )
}

function Botao( props : BotaoProps ) { 
  return (
    <Pressable onPress={props.onPress}>
      <View style={{borderRadius: 16, marginVertical: 42, backgroundColor: 'green'}}>
        <Text style={styles.botaoTexto}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  );
}

  export { FormularioMoto }
