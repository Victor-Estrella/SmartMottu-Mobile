import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { BotaoProps } from "../model/Botao";
import { styles } from "../styles/estilos";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { useThemeGlobal } from '../styles/ThemeContext';
import { useMoto } from "../contexto/MotoContext";
import { useTranslation } from 'react-i18next';

const FormularioMoto = (): React.ReactElement => {
  const [setorSelecionado, setSetorSelecionado] = useState("Pendencia");
  const [modelo, setModelo] = useState("Mottu Pop");
  const [unidade, setUnidade] = useState("");
  const [status, setStatus] = useState("");
  const [placa, setPlaca] = useState("");
  const [nmChassi, setNmChassi] = useState("");

  const { gravar, loading, mensagem } = useMoto();
  const { theme } = useThemeGlobal();
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={{ minHeight: "100%", alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
      <Text style={[styles.tituloFormulario, {color: theme.primary}]}>{t('moto.form.title')}</Text>
      <View style={{ width: "70%", backgroundColor: theme.background }}>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.sector')}</Text>
          <Picker style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} selectedValue={setorSelecionado} onValueChange={(itemValue, itemIndex) => setSetorSelecionado(itemValue)}>
            <Picker.Item label={t('moto.sectors.Pendencia')} value="Pendencia" />
            <Picker.Item label={t('moto.sectors.Reparo Simples')} value="Reparo Simples" />
            <Picker.Item label={t('moto.sectors.Danos Estruturais Graves')} value="Danos Estruturais Graves" />
            <Picker.Item label={t('moto.sectors.Motor Defeituoso')} value="Motor Defeituoso" />
            <Picker.Item label={t('moto.sectors.Agendada Para Manutencao')} value="Agendada Para Manutencao" />
            <Picker.Item label={t('moto.sectors.Pronta Para Aluguel')} value="Pronta Para Aluguel" />
            <Picker.Item label={t('moto.sectors.Sem Placa')} value="Sem Placa" />
            <Picker.Item label={t('moto.sectors.Minha Mottu')} value="Minha Mottu" />
            <Picker.Item label={t('moto.sectors.Outro')} value="Outro" />
          </Picker>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.model')}</Text>
          <Picker style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} selectedValue={modelo} onValueChange={(itemValue, itemIndex) => setModelo(itemValue)}>
            <Picker.Item label="Mottu Pop" value="Mottu Pop" />
            <Picker.Item label="Mottu Sport" value="Mottu Sport" />
            <Picker.Item label="Mottu-E" value="Mottu-E" />
          </Picker>
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.unit')}</Text>
          <TextInput value={unidade} onChangeText={setUnidade} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.unit')} placeholderTextColor={theme.text} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.status')}</Text>
          <TextInput value={status} onChangeText={setStatus} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.status')} placeholderTextColor={theme.text} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.plate')}</Text>
          <TextInput value={placa} onChangeText={setPlaca} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.plate')} placeholderTextColor={theme.text} maxLength={7} />
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.chassi')}</Text>
          <TextInput value={nmChassi} onChangeText={setNmChassi} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.chassi')} placeholderTextColor={theme.text} maxLength={17} />
        </View>
        {mensagem && (
          <Text style={{ color: mensagem === t('moto.messages.createSuccess') ? theme.primary : 'red', marginBottom: 8, textAlign: 'center' }}>{mensagem}</Text>
        )}
        <View style={{ alignItems: "center" }}>
          <Botao title={loading ? t('moto.form.buttonLoading') : t('moto.form.button')} onPress={async () => {
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
