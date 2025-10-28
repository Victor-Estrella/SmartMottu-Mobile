import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { BotaoProps } from "../model/Botao";
import { styles } from "../styles/estilos";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { useThemeGlobal } from '../styles/ThemeContext';
import { useMoto } from "../contexto/MotoContext";

const FormularioMoto = (): React.ReactElement => {
  const [setorSelecionado, setSetorSelecionado] = useState("Pendencia");
  const [modelo, setModelo] = useState("Mottu Pop");
  const [unidade, setUnidade] = useState("");
  const [status, setStatus] = useState("");
  const [placa, setPlaca] = useState("");
  const [nmChassi, setNmChassi] = useState("");

  const { gravar, loading, mensagem } = useMoto();
  const { theme } = useThemeGlobal();

  return (
    <ScrollView contentContainerStyle={{ minHeight: "100%", alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
      <Text style={[styles.tituloFormulario, {color: theme.primary}]}>Formulario de Cadastro da Moto</Text>
      <View style={{ width: "70%", backgroundColor: theme.background }}>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>Setor</Text>
          <Picker style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} selectedValue={setorSelecionado} onValueChange={(itemValue, itemIndex) => setSetorSelecionado(itemValue)}>
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
          <Text style={[styles.labelFormulario, {color: theme.text}]}>Modelo</Text>
          <Picker style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} selectedValue={modelo} onValueChange={(itemValue, itemIndex) => setModelo(itemValue)}>
            <Picker.Item label="Mottu Pop" value="Mottu Pop" />
            <Picker.Item label="Mottu Sport" value="Mottu Sport" />
            <Picker.Item label="Mottu-E" value="Mottu-E" />
          </Picker>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>Unidade</Text>
          <TextInput value={unidade} onChangeText={setUnidade} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholderTextColor={theme.text} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>Status</Text>
          <TextInput value={status} onChangeText={setStatus} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholderTextColor={theme.text} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>Placa</Text>
          <TextInput value={placa} onChangeText={setPlaca} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholderTextColor={theme.text} maxLength={7} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>Chassi</Text>
          <TextInput value={nmChassi} onChangeText={setNmChassi} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholderTextColor={theme.text} maxLength={17} />
        </View>
        {mensagem && (
          <Text style={{ color: mensagem.includes('sucesso') ? theme.primary : 'red', marginBottom: 8, textAlign: 'center' }}>{mensagem}</Text>
        )}
        <View style={{ alignItems: "center" }}>
          <Botao title={loading ? "Salvando..." : "Gravar"} onPress={async () => {
            await gravar(setorSelecionado, modelo, unidade, status, placa, nmChassi);
            // Não limpar imediatamente, deixa o usuário ver a mensagem
          }} theme={theme} />
        </View>
      </View>
    </ScrollView>
  );
}

function Botao(props: BotaoProps & { theme: any }) {
  return (
    <Pressable onPress={props.onPress}>
      <View style={{ borderRadius: 16, marginVertical: 42, backgroundColor: props.theme.button }}>
        <Text style={[styles.botaoTexto, {color: props.theme.buttonText}]}>
          {props.title}
        </Text>
      </View>
    </Pressable>
  );
}

export { FormularioMoto };
