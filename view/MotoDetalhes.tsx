import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BotaoProps } from '../model/Botao';
import { styles } from '../styles/estilos';
import { Moto } from '../model/Moto';
import { useMoto } from '../contexto/MotoContext';
import { useTheme } from '../styles/theme';
import { useThemeGlobal } from '../styles/ThemeContext';

const MotoDetalhes = ({ navigation }: { navigation: any }) => {
    const { deletar, atualizar, loading, listaMoto } = useMoto();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [editMoto, setEditMoto] = useState<Moto | null>(null);
    const { theme } = useThemeGlobal();

    // Busca o idMoto dos parâmetros de navegação
    const idMotoParam = route.params && (route.params as any).idMoto;
    // Busca a moto atualizada pelo idMoto do contexto global
    const motoExibir = listaMoto.find(m => String(m.idMoto) === String(idMotoParam));

    if (!idMotoParam || !motoExibir) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <Text style={{ color: theme.text, fontSize: 18, marginBottom: 30 }}>Nenhuma moto selecionada</Text>
                <Botao title="Voltar" onPress={() => navigation.navigate("Listagem")} />
            </View>
        );
    }

    const deletarMoto = async () => {
        await deletar(motoExibir.id || motoExibir.idMoto);
        Alert.alert("Sucesso", "Moto deletada com sucesso!");
        navigation.navigate("Listagem");
    };

    const abrirModalAtualizar = () => {
        setEditMoto(motoExibir);
        setModalVisible(true);
    };

    const salvarAtualizacao = async () => {
        if (editMoto) {
            await atualizar(editMoto.id || editMoto.idMoto, editMoto);
            setModalVisible(false);
            Alert.alert("Sucesso", "Moto atualizada com sucesso!");
        }
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.formBackground}}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.primary, marginTop: 30 }}>Detalhes da Moto</Text>
            <View style={{ marginTop: 20, backgroundColor: theme.formBackground }}>
                <Text style={{color: theme.formText}}>Setor: {motoExibir.setor}</Text>
                <Text style={{color: theme.formText}}>ID: {motoExibir.idMoto || motoExibir.id}</Text>
                <Text style={{color: theme.formText}}>Modelo: {motoExibir.modelo}</Text>
                <Text style={{color: theme.formText}}>Unidade: {motoExibir.unidade}</Text>
                <Text style={{color: theme.formText}}>Status: {motoExibir.status}</Text>
                <Text style={{color: theme.formText}}>Placa: {motoExibir.placa}</Text>
                <Text style={{color: theme.formText}}>Chassi: {motoExibir.nmChassi}</Text>
                <View style={{ marginTop: 20 }}>
                    <Botao title={loading ? "Atualizando..." : "Atualizar"} onPress={abrirModalAtualizar} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Botao title={loading ? "Deletando..." : "Deletar"} onPress={deletarMoto} />
                </View>
            </View>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <View style={{ backgroundColor: theme.formBackground, padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10, color: theme.formText }}>Editar Moto</Text>
                        <Text style={{ fontWeight: 'bold', marginBottom: 4, color: theme.formText }}>Setor</Text>
                        <Picker selectedValue={editMoto?.setor || ''} onValueChange={v => setEditMoto((e: Moto) => ({...e!, setor: v}))} style={{ marginBottom: 8, color: theme.formText }}>
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
                        <Text style={{ fontWeight: 'bold', marginBottom: 4, color: theme.formText }}>Modelo</Text>
                        <Picker selectedValue={editMoto?.modelo || ''} onValueChange={v => setEditMoto((e: Moto) => ({...e!, modelo: v}))} style={{ marginBottom: 8, color: theme.formText }}>
                            <Picker.Item label="Mottu Pop" value="Mottu Pop" />
                            <Picker.Item label="Mottu Sport" value="Mottu Sport" />
                            <Picker.Item label="Mottu-E" value="Mottu-E" />
                        </Picker>
                        <TextInput value={editMoto?.unidade || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, unidade: v}))} placeholder="Unidade" style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <TextInput value={editMoto?.status || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, status: v}))} placeholder="Status" style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <TextInput value={editMoto?.placa || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, placa: v}))} placeholder="Placa" style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <TextInput value={editMoto?.nmChassi || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, nmChassi: v}))} placeholder="Chassi" style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                            <Botao title="Salvar" onPress={salvarAtualizacao} />
                            <Botao title="Cancelar" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

function Botao(props: BotaoProps) {
    const theme = useTheme();
    return (
        <Pressable onPress={props.onPress}>
            <View style={{ borderRadius: 16, backgroundColor: theme.button }}>
                <Text style={[styles.botaoTexto, {color: theme.buttonText}]}>
                    {props.title}
                </Text>
            </View>
        </Pressable>
    );
}

export default MotoDetalhes;
