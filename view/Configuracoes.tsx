import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
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
import i18n, { changeLanguage, supportedLanguages, SupportedLanguageCode } from '../i18n';

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
    const [pushFeedback, setPushFeedback] = React.useState<{ texto: string, tipo: 'sucesso' | 'erro' | 'info' | '' }>({ texto: '', tipo: '' });
    const [registeringPush, setRegisteringPush] = React.useState(false);
    const [testingPush, setTestingPush] = React.useState(false);
    const [idUsuario, setIdUsuario] = React.useState<number | null>(null);
    const { theme, isDark } = useThemeGlobal();
    const { atualizar, deletar, loading } = useCadastroControl();
    const { sendPushNotificationAsync, registerForPushNotificationsAsync, expoPushToken, permissionStatus, registrationError } = useNotification();
    const { t } = useTranslation();
    const [language, setLanguage] = React.useState<SupportedLanguageCode>(() => (i18n.language.startsWith('es') ? 'es' : 'pt'));



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
                setLanguage(lng as SupportedLanguageCode);
            }
        };
        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    const handleLanguageSelection = async (value: SupportedLanguageCode) => {
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

    const handleRegisterPush = async () => {
        setRegisteringPush(true);
        setPushFeedback({ texto: '', tipo: '' });
        try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
                setPushFeedback({ texto: t('settings.push.feedback.registered'), tipo: 'sucesso' });
            } else {
                const messageKey: 'fcmRequired' | 'missing' =
                    registrationError && registrationError.toLowerCase().includes('firebaseapp')
                        ? 'fcmRequired'
                        : 'missing';
                const message =
                    messageKey === 'fcmRequired'
                        ? t('settings.push.feedback.fcmRequired')
                        : t('settings.push.feedback.missing');
                setPushFeedback({ texto: message, tipo: 'erro' });
            }
        } catch (error) {
            const messageKey: 'fcmRequired' | 'missing' =
                registrationError && registrationError.toLowerCase().includes('firebaseapp')
                    ? 'fcmRequired'
                    : 'missing';
            const message =
                messageKey === 'fcmRequired'
                    ? t('settings.push.feedback.fcmRequired')
                    : t('settings.push.feedback.missing');
            setPushFeedback({ texto: message, tipo: 'erro' });
        } finally {
            setRegisteringPush(false);
        }
    };

    const handleTestPush = async () => {
        setTestingPush(true);
        setPushFeedback({ texto: '', tipo: '' });
        try {
            const delivered = await sendPushNotificationAsync({
                title: t('settings.push.testTitle'),
                body: t('settings.push.testBody'),
                data: {
                    type: 'test-notification',
                    sentAt: new Date().toISOString(),
                },
            });
            if (delivered) {
                setPushFeedback({ texto: t('settings.push.feedback.testSent'), tipo: 'sucesso' });
            } else {
                setPushFeedback({ texto: t('settings.push.feedback.testScheduled'), tipo: 'info' });
            }
        } catch (error) {
            setPushFeedback({ texto: t('settings.push.feedback.missing'), tipo: 'erro' });
        } finally {
            setTestingPush(false);
        }
    };

    const knownPermissionStatuses = ['granted', 'denied', 'undetermined', 'provisional'] as const;
    const permissionKey = knownPermissionStatuses.includes(permissionStatus as typeof knownPermissionStatuses[number])
        ? (permissionStatus as typeof knownPermissionStatuses[number])
        : 'unknown';
    const permissionLabel = t(`settings.push.status.${permissionKey as 'granted' | 'denied' | 'undetermined' | 'provisional' | 'unknown'}`);
    const tokenDisplay = expoPushToken ?? t('settings.push.tokenUnavailable');
    const pickerTextColor = isDark ? theme.primary : theme.formText;

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
                    onValueChange={(value: SupportedLanguageCode) => handleLanguageSelection(value)}
                    style={[styles.inputConfig, { backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                    dropdownIconColor={theme.primary}
                    itemStyle={{ color: pickerTextColor }}
                >
                    {supportedLanguages.map(lang => (
                        <Picker.Item key={lang.code} label={lang.label} value={lang.code} color={pickerTextColor} />
                    ))}
                </Picker>
            </View>
            <View
                style={{
                    width: '100%',
                    marginTop: 24,
                    backgroundColor: theme.card,
                    borderRadius: 12,
                    padding: 16,
                    borderColor: theme.primary,
                    borderWidth: 1,
                }}
            >
                <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
                    {t('settings.push.title')}
                </Text>
                <Text style={{ color: theme.text, marginBottom: 4 }}>
                    {t('settings.push.statusLabel')}: <Text style={{ fontWeight: 'bold' }}>{permissionLabel}</Text>
                </Text>
                <Text style={{ color: theme.text, marginBottom: 8 }}>
                    {t('settings.push.tokenLabel')}:
                </Text>
                <View style={{ backgroundColor: theme.background, borderRadius: 8, padding: 12, borderWidth: 1, borderColor: theme.primary + '33' }}>
                    <Text selectable style={{ color: theme.text, fontFamily: 'monospace' }}>{tokenDisplay}</Text>
                </View>
                {pushFeedback.texto ? (
                    <Text
                        style={{
                            color:
                                pushFeedback.tipo === 'sucesso'
                                    ? theme.primary
                                    : pushFeedback.tipo === 'erro'
                                    ? '#d9534f'
                                    : theme.text,
                            marginTop: 12,
                        }}
                    >
                        {pushFeedback.texto}
                    </Text>
                ) : null}
                <Pressable
                    onPress={handleRegisterPush}
                    disabled={registeringPush}
                    style={({ pressed }) => ({
                        marginTop: 16,
                        backgroundColor: theme.button,
                        borderRadius: 16,
                        paddingVertical: 12,
                        opacity: registeringPush || pressed ? 0.7 : 1,
                    })}
                >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                        {registeringPush ? t('settings.push.registerLoading') : t('settings.push.register')}
                    </Text>
                </Pressable>
                <Pressable
                    onPress={handleTestPush}
                    disabled={testingPush}
                    style={({ pressed }) => ({
                        marginTop: 12,
                        backgroundColor: theme.primary,
                        borderRadius: 16,
                        paddingVertical: 12,
                        opacity: testingPush || pressed ? 0.7 : 1,
                    })}
                >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                        {testingPush ? t('settings.push.testLoading') : t('settings.push.test')}
                    </Text>
                </Pressable>
                <Text style={{ color: theme.text, fontSize: 12, marginTop: 12 }}>
                    {t('settings.push.localFallbackNotice')}
                </Text>
            </View>
            <View style={styles.deleteConfig}>
                <Botao title={loading ? t('settings.buttons.updateLoading') : t('settings.buttons.update')} color={theme.button} onPress={atualizarConta} />
                <Botao title={loading ? t('settings.buttons.deleteLoading') : t('settings.buttons.delete')} color="#d9534f" onPress={deletarConta} />
            </View>
            {loading ? <ActivityIndicator style={{ marginTop: 12, alignSelf: 'center' }} color={theme.primary} /> : null}
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