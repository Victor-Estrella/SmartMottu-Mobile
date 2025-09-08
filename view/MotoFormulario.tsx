import { useState } from "react";
import { useMotoControl } from '../control/motoControl';
import { Pressable, Text, TextInput, View } from "react-native";
import { BotaoProps } from "../model/Botao";
import { styles } from "../styles/estilos";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

const FormularioMoto = (): React.ReactElement => {
  const [setorSelecionado, setSetorSelecionado] = useState("Pendencia");
  const [modelo, setModelo] = useState("Mottu Pop");
  const [unidade, setUnidade] = useState("");
  const [status, setStatus] = useState("");
  const [placa, setPlaca] = useState("");
  const [nmChassi, setNmChassi] = useState("");
  const [id, setId] = useState("");

  const { gravar, loading } = useMotoControl();
  const limparFormulario = () => {
    setSetorSelecionado("Pendencia");
    setModelo("Mottu Pop");
    setUnidade("");
    setStatus("");
    setPlaca("");
    setNmChassi("");
    setId("");
  };

  return (
    <ScrollView contentContainerStyle={{ minHeight: "100%", alignItems: "center", justifyContent: "center", backgroundColor: "black" }}>
      <Text style={styles.tituloFormulario}>Formulario de Cadastro da Moto</Text>
      <View style={{ width: "70%", backgroundColor: "black" }}>
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
          <TextInput value={id} onChangeText={setId} style={styles.input} placeholderTextColor="white" />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Modelo</Text>
          <Picker style={styles.input} selectedValue={modelo} onValueChange={(itemValue, itemIndex) => setModelo(itemValue)}>
            <Picker.Item label="Mottu Pop" value="Mottu Pop" />
            <Picker.Item label="Mottu Sport" value="Mottu Sport" />
            <Picker.Item label="Mottu-E" value="Mottu-E" />
          </Picker>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Unidade</Text>
          <TextInput value={unidade} onChangeText={setUnidade} style={styles.input} placeholderTextColor="white" />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Status</Text>
          <TextInput value={status} onChangeText={setStatus} style={styles.input} placeholderTextColor="white" />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Placa</Text>
          <TextInput value={placa} onChangeText={setPlaca} style={styles.input} placeholderTextColor="white" maxLength={7} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={styles.labelFormulario}>Chassi</Text>
          <TextInput value={nmChassi} onChangeText={setNmChassi} style={styles.input} placeholderTextColor="white" maxLength={17} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Botao title={loading ? "Salvando..." : "Gravar"} onPress={async () => {
            await gravar(setorSelecionado, id, modelo, unidade, status, placa, nmChassi);
            limparFormulario();
          }} />
        </View>
      </View>
    </ScrollView>
  );
};

function Botao(props: BotaoProps) {
  return (
    <Pressable onPress={props.onPress}>
      <View style={{ borderRadius: 16, marginVertical: 42, backgroundColor: "green" }}>
        <Text style={styles.botaoTexto}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  );
}

export { FormularioMoto };
