
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
import QRCode from 'react-native-qrcode-svg';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';


const MotoDetalhes = ({ navigation }: { navigation: any }) => {
    const { deletar, atualizar, loading, listaMoto } = useMoto();
    const route = useRoute();
    const [modalVisible, setModalVisible] = useState(false);
    const [editMoto, setEditMoto] = useState<Moto | null>(null);
    const { theme } = useThemeGlobal();
    const { t } = useTranslation();

    // Busca o idMoto dos parâmetros de navegação
    const idMotoParam = route.params && (route.params as any).idMoto;
    // Busca a moto atualizada pelo idMoto do contexto global
    const motoExibir = listaMoto.find(m => String(m.idMoto) === String(idMotoParam));

    if (!idMotoParam || !motoExibir) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
                <Text style={{ color: theme.text, fontSize: 18, marginBottom: 30 }}>{t('moto.details.noSelection')}</Text>
                <Botao title={t('common.actions.back')} onPress={() => navigation.navigate("MotoListagem")} />
            </View>
        );
    }

    const deletarMoto = async () => {
        await deletar(motoExibir.id || motoExibir.idMoto);
        Alert.alert(t('alerts.success'), t('moto.details.success.deleted'));
        navigation.navigate("MotoListagem");
    };

    const abrirModalAtualizar = () => {
        setEditMoto(motoExibir);
        setModalVisible(true);
    };

    const salvarAtualizacao = async () => {
        if (editMoto) {
            await atualizar(editMoto.id || editMoto.idMoto, editMoto);
            setModalVisible(false);
            Alert.alert(t('alerts.success'), t('moto.details.success.updated'));
        }
    };

    const setorLabel = motoExibir.setor ? t(`moto.sectors.${motoExibir.setor}`) : motoExibir.setor;

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.formBackground}}>
            <View style={{alignSelf: 'flex-start', marginLeft: 10}}>
                <BotaoVoltar title={t('common.actions.back')} onPress={()=>{navigation.navigate("MotoListagem");}}></BotaoVoltar>
            </View>
            <Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.primary, marginTop: 30 }}>{t('moto.details.title')}</Text>
            {/* QRCode da moto */}
            {motoExibir.qrcode && (
                <View style={{ marginVertical: 24, alignItems: 'center' }}>
                    <QRCode value={motoExibir.qrcode} size={180} />
                    <Text style={{color: theme.formText, marginTop: 8, fontSize: 12}}>{t('moto.details.qr')}</Text>
                </View>
            )}
            <View style={{ marginTop: 20, backgroundColor: theme.formBackground }}>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.sector')}: {setorLabel || motoExibir.setor}</Text>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.id')}: {motoExibir.idMoto || motoExibir.id}</Text>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.model')}: {motoExibir.modelo}</Text>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.unit')}: {motoExibir.unidade}</Text>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.status')}: {motoExibir.status}</Text>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.plate')}: {motoExibir.placa}</Text>
                <Text style={{color: theme.formText}}>{t('moto.details.labels.chassi')}: {motoExibir.nmChassi}</Text>
                <View style={{ marginTop: 20 }}>
                    <Botao title={loading ? t('moto.details.buttons.updateLoading') : t('moto.details.buttons.update')} onPress={abrirModalAtualizar} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Botao title={loading ? t('moto.details.buttons.deleteLoading') : t('moto.details.buttons.delete')} onPress={deletarMoto} />
                </View>
            </View>
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <View style={{ backgroundColor: theme.formBackground, padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10, color: theme.formText }}>{t('moto.details.modalTitle')}</Text>
                        <Text style={{ fontWeight: 'bold', marginBottom: 4, color: theme.formText }}>{t('moto.details.labels.sector')}</Text>
                        <Picker selectedValue={editMoto?.setor || ''} onValueChange={v => setEditMoto((e: Moto) => ({...e!, setor: v}))} style={{ marginBottom: 8, color: theme.formText }}>
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
                        <Text style={{ fontWeight: 'bold', marginBottom: 4, color: theme.formText }}>{t('moto.details.labels.model')}</Text>
                        <Picker selectedValue={editMoto?.modelo || ''} onValueChange={v => setEditMoto((e: Moto) => ({...e!, modelo: v}))} style={{ marginBottom: 8, color: theme.formText }}>
                            <Picker.Item label="Mottu Pop" value="Mottu Pop" />
                            <Picker.Item label="Mottu Sport" value="Mottu Sport" />
                            <Picker.Item label="Mottu-E" value="Mottu-E" />
                        </Picker>
                        <TextInput value={editMoto?.unidade || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, unidade: v}))} placeholder={t('moto.details.labels.unit')} style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <TextInput value={editMoto?.status || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, status: v}))} placeholder={t('moto.details.labels.status')} style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <TextInput value={editMoto?.placa || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, placa: v}))} placeholder={t('moto.details.labels.plate')} style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <TextInput value={editMoto?.nmChassi || ''} onChangeText={v => setEditMoto((e: Moto) => ({...e!, nmChassi: v}))} placeholder={t('moto.details.labels.chassi')} style={{ borderBottomWidth: 1, marginBottom: 8, color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }} placeholderTextColor={theme.formText} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                            <Botao title={t('common.actions.save')} onPress={salvarAtualizacao} />
                            <Botao title={t('common.actions.cancel')} onPress={() => setModalVisible(false)} />
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

function BotaoVoltar(props: BotaoProps) {
    const theme = useTheme();
    return (
        <Pressable onPress={props.onPress}>
            <View style={{ borderRadius: 16, backgroundColor: theme.button, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 6 }}>
                <AntDesign name="arrow-left" size={24} color="white" />
                <Text style={[styles.botaoTexto, {color: theme.buttonText}]}>{props.title}</Text>
            </View>
        </Pressable>
    );
}

export default MotoDetalhes;
