import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/estilos';
import { BotaoPropsConfig } from '../model/BotaoPropsConfig';
import { useThemeGlobal } from '../styles/ThemeContext';
import { useCadastroControl } from '../control/cadastroControl';
import { buscarUsuarioPorEmail } from '../fetcher/cadastroFetcher';
import CadastroProps from '../model/CadastroProps';
import { validarEmail } from '../utils/email';
import { useNotification } from '../contexto/NotificationContext';
import { useTranslation } from 'react-i18next';
import i18n, { changeLanguage, supportedLanguages } from '../i18n';

type ConfiguracoesProps = CadastroProps & {
    SucessoLogout?: () => void;
};

const Configuracoes = (props: ConfiguracoesProps): React.ReactElement => {
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [erroNome, setErroNome] = React.useState('');
    const [erroEmail, setErroEmail] = React.useState('');
    const [erroSenha, setErroSenha] = React.useState('');
    const [mensagem, setMensagem] = React.useState<{ texto: string, tipo: 'sucesso' | 'erro' | '' }>({ texto: '', tipo: '' });
    const [idUsuario, setIdUsuario] = React.useState<number | null>(null);
    const { theme } = useThemeGlobal();
    const { atualizar, deletar, loading } = useCadastroControl();
    const { sendPushNotificationAsync } = useNotification();
    const { t } = useTranslation();
    const [language, setLanguage] = React.useState<'pt' | 'es'>(() => (i18n.language.startsWith('es') ? 'es' : 'pt'));



    // Ao montar, pega o email do AsyncStorage e busca o id do usuário
    const [emailOriginal, setEmailOriginal] = React.useState<string>('');
    const [nomeOriginal, setNomeOriginal] = React.useState<string>('');
    React.useEffect(() => {
        const fetchEmailAndId = async () => {
            try {
                const emailStorage = await AsyncStorage.getItem('email');
                if (emailStorage) {
                    setEmail(emailStorage);
                    setEmailOriginal(emailStorage);
                    // Busca o usuário pelo email original
                    const usuario = await buscarUsuarioPorEmail(emailStorage);
                    if (usuario && usuario.idUsuario) {
                        setIdUsuario(usuario.idUsuario);
                        setNome(usuario.nome || '');
                        setNomeOriginal(usuario.nome || '');
                    }
                }
            } catch (e) {
                setMensagem({ texto: t('settings.messages.loadError'), tipo: 'erro' });
            }
        };
        fetchEmailAndId();
    }, []);

    React.useEffect(() => {
        const handleLanguageChange = (lng: string) => {
            if (lng === 'pt' || lng === 'es') {
                setLanguage(lng);
            }
        };
        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    const handleLanguageSelection = async (value: 'pt' | 'es') => {
        setLanguage(value);
        await changeLanguage(value);
    };

    const atualizarConta = async () => {
        setErroNome('');
        setErroEmail('');
        setErroSenha('');
        setMensagem({ texto: '', tipo: '' });
        let erro = false;
        if (!nome.trim()) {
            setErroNome(t('validation.nameRequired'));
            erro = true;
        }
        if (!email.trim()) {
            setErroEmail(t('validation.emailRequired'));
            erro = true;
        } else if (!validarEmail(email)) {
            setErroEmail(t('validation.emailInvalid'));
            erro = true;
        }
        if (senha && senha.length > 0 && senha.length < 8) {
            setErroSenha(t('validation.passwordMin'));
            erro = true;
        }
        if (erro) return;
        if (!idUsuario) {
            setMensagem({ texto: t('validation.userIdMissing'), tipo: 'erro' });
            return;
        }
        const usuarioAtualizado: any = { nome, email };
        if (senha && senha.length >= 8) usuarioAtualizado.senha = senha;
        const nomeAlterado = nome !== nomeOriginal;
        const emailAlterado = email !== emailOriginal;
        const senhaAlterada = Boolean(usuarioAtualizado.senha);
        // Atualiza usando o id do usuário buscado pelo email original
        const resultado = await atualizar(String(idUsuario), usuarioAtualizado);
        if (resultado.sucesso) {
            if (emailAlterado) {
                await AsyncStorage.setItem('email', email);
                setEmailOriginal(email);
            }
            setMensagem({ texto: resultado.mensagem, tipo: 'sucesso' });
            setSenha('');
            const updatedFieldKeys: string[] = [];
            const camposAlterados = [] as string[];
            if (nomeAlterado) {
                updatedFieldKeys.push('name');
                camposAlterados.push(t('settings.notifications.updatedFields.name'));
            }
            if (emailAlterado) {
                updatedFieldKeys.push('email');
                camposAlterados.push(t('settings.notifications.updatedFields.email'));
            }
            if (senhaAlterada) {
                updatedFieldKeys.push('password');
                camposAlterados.push(t('settings.notifications.updatedFields.password'));
            }
            if (camposAlterados.length) {
                const descricaoAlteracoes = camposAlterados.join(', ');
                await sendPushNotificationAsync({
                    title: t('settings.notifications.accountUpdatedTitle'),
                    body: t('settings.notifications.accountUpdated', { fields: descricaoAlteracoes }),
                    data: {
                        type: 'account-updated',
                        updatedFields: updatedFieldKeys,
                    },
                });
            }
            if (nomeAlterado) {
                setNomeOriginal(nome);
            }
        } else {
            setMensagem({ texto: resultado.mensagem, tipo: 'erro' });
        }
    };

    const deletarConta = async () => {
        setErroEmail('');
        setMensagem({ texto: '', tipo: '' });
        // Busca o idUsuario pelo email original do login
        try {
            if (!emailOriginal || !validarEmail(emailOriginal)) {
                setErroEmail(t('settings.messages.deleteForbidden'));
                return;
            }
            const usuario = await buscarUsuarioPorEmail(emailOriginal);
            if (!usuario || !usuario.idUsuario) {
                setMensagem({ texto: t('settings.messages.userNotFound'), tipo: 'erro' });
                return;
            }
            await deletar(String(usuario.idUsuario));
            setMensagem({ texto: t('settings.messages.deleteSuccess'), tipo: 'sucesso' });
            await sendPushNotificationAsync({
                title: t('settings.notifications.accountDeletedTitle'),
                body: t('settings.notifications.accountDeleted'),
                data: { type: 'account-deleted', userEmail: emailOriginal },
            });
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('TOKEN');
            // Chama SucessoLogout igual ao botão de sair do MotoModulo
            if (props.SucessoLogout && typeof props.SucessoLogout === 'function') {
                props.SucessoLogout();
            }
        } catch (e) {
            setMensagem({ texto: t('settings.messages.deleteError'), tipo: 'erro' });
        }
    };

    return (
        <View style={[styles.containerConfig, { backgroundColor: theme.background }]}> 
            <Text style={[styles.tituloConfig, { color: theme.primary }]}>{t('settings.title')}</Text>
            {mensagem.texto ? (
                <Text style={{ color: mensagem.tipo === 'sucesso' ? theme.primary : 'red', marginBottom: 10, marginLeft: 10, fontWeight: 'bold', }}>{mensagem.texto}</Text>
            ) : null}
            <TextInput style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder={t('settings.placeholders.name')} value={nome} onChangeText={text => { setNome(text); if (erroNome) setErroNome(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText}
            />
            {erroNome ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroNome}</Text> : null}
            <TextInput style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder={t('settings.placeholders.email')} value={email} onChangeText={text => {
                    setEmail(text);
                    if (erroEmail) setErroEmail('');
                    if (mensagem.texto) setMensagem({ texto: '', tipo: '' });
                }}
                placeholderTextColor={theme.formText} keyboardType="email-address" autoCapitalize="none"
            />
            {erroEmail ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroEmail}</Text> : null}
            <TextInput style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder={t('settings.placeholders.password')} value={senha} onChangeText={text => { setSenha(text); if (erroSenha) setErroSenha(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText} secureTextEntry
            />
            {erroSenha ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroSenha}</Text> : null}
            <View style={{ width: '100%', marginTop: 16 }}>
                <Text style={{ color: theme.text, marginLeft: 8, marginBottom: 4 }}>{t('settings.language.label')}</Text>
                <Picker
                    selectedValue={language}
                    onValueChange={(value: 'pt' | 'es') => handleLanguageSelection(value)}
                    style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                    dropdownIconColor={theme.formText}
                >
                    {supportedLanguages.map(lang => (
                        <Picker.Item key={lang.code} label={lang.label} value={lang.code as 'pt' | 'es'} color={theme.formText} />
                    ))}
                </Picker>
            </View>
            <View style={styles.deleteConfig}>
                <Botao title={loading ? t('settings.buttons.updateLoading') : t('settings.buttons.update')} color={theme.button} onPress={atualizarConta} />
                <Botao title={t('settings.buttons.delete')} color="#d9534f" onPress={deletarConta} />
            </View>
        </View>
    );
};

function Botao(props: BotaoPropsConfig) {
    return (
        <Pressable onPress={props.onPress}>
            <View style={{backgroundColor: props.color, borderRadius: 16, marginHorizontal: 12 }}>
                <Text style={styles.botaoTexto}>{props.title}</Text>
            </View>
        </Pressable>
    );
}

export default Configuracoes;