import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
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
  const [erros, setErros] = useState<{ setor?: string; modelo?: string; unidade?: string; status?: string; placa?: string; nmChassi?: string }>({});

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
          {erros.setor ? <Text style={{ color: 'red', marginTop: 4 }}>{erros.setor}</Text> : null}
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.model')}</Text>
          <Picker style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} selectedValue={modelo} onValueChange={(itemValue, itemIndex) => setModelo(itemValue)}>
            <Picker.Item label="Mottu Pop" value="Mottu Pop" />
            <Picker.Item label="Mottu Sport" value="Mottu Sport" />
            <Picker.Item label="Mottu-E" value="Mottu-E" />
          </Picker>
          {erros.modelo ? <Text style={{ color: 'red', marginTop: 4 }}>{erros.modelo}</Text> : null}
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.unit')}</Text>
          <TextInput value={unidade} onChangeText={(v)=>{ setUnidade(v); if (erros.unidade) setErros(e=>({...e, unidade: undefined})); }} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.unit')} placeholderTextColor={theme.text} />
          {erros.unidade ? <Text style={{ color: 'red', marginTop: 4 }}>{erros.unidade}</Text> : null}
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.status')}</Text>
          <TextInput value={status} onChangeText={(v)=>{ setStatus(v); if (erros.status) setErros(e=>({...e, status: undefined})); }} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.status')} placeholderTextColor={theme.text} />
          {erros.status ? <Text style={{ color: 'red', marginTop: 4 }}>{erros.status}</Text> : null}
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.plate')}</Text>
          <TextInput value={placa} onChangeText={(v)=>{ setPlaca(v); if (erros.placa) setErros(e=>({...e, placa: undefined})); }} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.plate')} placeholderTextColor={theme.text} maxLength={7} />
          {erros.placa ? <Text style={{ color: 'red', marginTop: 4 }}>{erros.placa}</Text> : null}
        </View>
        <View style={styles.viewInputFormulario}>
          <Text style={[styles.labelFormulario, {color: theme.text}]}>{t('moto.form.fields.chassi')}</Text>
          <TextInput value={nmChassi} onChangeText={(v)=>{ setNmChassi(v); if (erros.nmChassi) setErros(e=>({...e, nmChassi: undefined})); }} style={[styles.input, {color: theme.text, backgroundColor: theme.secondary}]} placeholder={t('moto.form.fields.chassi')} placeholderTextColor={theme.text} maxLength={17} />
          {erros.nmChassi ? <Text style={{ color: 'red', marginTop: 4 }}>{erros.nmChassi}</Text> : null}
        </View>
        {mensagem && (
          <Text style={{ color: mensagem === t('moto.messages.createSuccess') ? theme.primary : 'red', marginBottom: 8, textAlign: 'center' }}>{mensagem}</Text>
        )}
        <View style={{ alignItems: "center" }}>
          <Botao title={loading ? t('moto.form.buttonLoading') : t('moto.form.button')} onPress={async () => {
            if (loading) return;
            const novosErros: typeof erros = {};
            if (!setorSelecionado) novosErros.setor = t('moto.validation.sectorRequired');
            if (!modelo) novosErros.modelo = t('moto.validation.modelRequired');
            if (!unidade) novosErros.unidade = t('moto.validation.unitRequired');
            if (!status) novosErros.status = t('moto.validation.statusRequired');
            if (!placa) novosErros.placa = t('moto.validation.plateRequired');
            else if (placa.length !== 7) novosErros.placa = t('moto.validation.plateLength');
            if (!nmChassi) novosErros.nmChassi = t('moto.validation.chassiRequired');
            else if (nmChassi.length !== 17) novosErros.nmChassi = t('moto.validation.chassiLength');
            setErros(novosErros);
            if (Object.keys(novosErros).length > 0) return;
            await gravar(setorSelecionado, modelo, unidade, status, placa, nmChassi);
          }} theme={theme} />
          {loading ? <ActivityIndicator style={{ marginTop: 12 }} color={theme.primary} /> : null}
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
