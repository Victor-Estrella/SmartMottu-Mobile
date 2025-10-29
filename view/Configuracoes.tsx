import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { styles } from '../styles/estilos';
import { BotaoPropsConfig } from '../model/BotaoPropsConfig';
import { useThemeGlobal } from '../styles/ThemeContext';
import { useCadastroControl } from '../control/cadastroControl';
import { buscarUsuarioPorEmail } from '../fetcher/cadastroFetcher';
import CadastroProps from '../model/CadastroProps';
import { validarEmail } from '../utils/email';
import { useNotification } from '../contexto/NotificationContext';

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
    const { sendPushNotificationAsync, scheduleLocalNotification, lastNotification } = useNotification();



    // Ao montar, pega o email do AsyncStorage e busca o id do usuário
    const [emailOriginal, setEmailOriginal] = React.useState<string>('');
    const [nomeOriginal, setNomeOriginal] = React.useState<string>('');
    const [statusAgendamento, setStatusAgendamento] = React.useState<string | null>(null);

    const enviarNotificacaoTeste = React.useCallback(() => {
        setStatusAgendamento(null);
        scheduleLocalNotification({
            title: 'Notificação do SmartMottu',
            body: 'Disparamos uma notificação local para você conferir o comportamento.',
            seconds: 5,
            data: { type: 'local-test' },
        }).then(id => {
            if (id) {
                const message = `Notificação ${id} programada. Coloque o app em segundo plano para ver o banner.`;
                setStatusAgendamento(message);
                Alert.alert('Agendado', message);
            } else {
                const message = 'Não foi possível agendar a notificação. Verifique as permissões do sistema.';
                setStatusAgendamento(message);
                Alert.alert('Permissão necessária', message);
            }
        });
    }, [scheduleLocalNotification]);
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
                setMensagem({ texto: 'Erro ao carregar dados do usuário.', tipo: 'erro' });
            }
        };
        fetchEmailAndId();
    }, []);

    const atualizarConta = async () => {
        setErroNome('');
        setErroEmail('');
        setErroSenha('');
        setMensagem({ texto: '', tipo: '' });
        let erro = false;
        if (!nome.trim()) {
            setErroNome('O nome é obrigatório.');
            erro = true;
        }
        if (!email.trim()) {
            setErroEmail('O e-mail é obrigatório.');
            erro = true;
        } else if (!validarEmail(email)) {
            setErroEmail('Digite um e-mail válido.');
            erro = true;
        }
        if (senha && senha.length > 0 && senha.length < 8) {
            setErroSenha('A senha deve ter pelo menos 8 caracteres.');
            erro = true;
        }
        if (erro) return;
        if (!idUsuario) {
            setMensagem({ texto: 'ID do usuário não encontrado.', tipo: 'erro' });
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
            const camposAlterados = [
                nomeAlterado ? 'nome' : null,
                emailAlterado ? 'e-mail' : null,
                senhaAlterada ? 'senha' : null,
            ].filter(Boolean);
            if (camposAlterados.length) {
                const descricaoAlteracoes = camposAlterados.join(', ');
                await sendPushNotificationAsync({
                    title: 'Conta atualizada',
                    body: `Alteramos seu ${descricaoAlteracoes}.`,
                    data: {
                        type: 'account-updated',
                        updatedFields: camposAlterados,
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
                setErroEmail('Email original inválido. Faça login novamente.');
                return;
            }
            const usuario = await buscarUsuarioPorEmail(emailOriginal);
            if (!usuario || !usuario.idUsuario) {
                setMensagem({ texto: 'ID do usuário não encontrado para exclusão.', tipo: 'erro' });
                return;
            }
            await deletar(String(usuario.idUsuario));
            setMensagem({ texto: 'Conta deletada com sucesso!', tipo: 'sucesso' });
            await sendPushNotificationAsync({
                title: 'Conta removida',
                body: 'Sua conta foi excluída deste dispositivo.',
                data: { type: 'account-deleted', userEmail: emailOriginal },
            });
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('TOKEN');
            // Chama SucessoLogout igual ao botão de sair do MotoModulo
            if (props.SucessoLogout && typeof props.SucessoLogout === 'function') {
                props.SucessoLogout();
            }
        } catch (e) {
            setMensagem({ texto: 'Erro ao deletar conta.', tipo: 'erro' });
        }
    };

    return (
        <View style={[styles.containerConfig, { backgroundColor: theme.background }]}> 
            <Text style={[styles.tituloConfig, { color: theme.primary }]}>Configurações da Conta</Text>
            {mensagem.texto ? (
                <Text style={{ color: mensagem.tipo === 'sucesso' ? theme.primary : 'red', marginBottom: 10, marginLeft: 10, fontWeight: 'bold', }}>{mensagem.texto}</Text>
            ) : null}
            <TextInput style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="Nome" value={nome} onChangeText={text => { setNome(text); if (erroNome) setErroNome(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText}
            />
            {erroNome ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroNome}</Text> : null}
            <TextInput style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="E-mail" value={email} onChangeText={text => {
                    setEmail(text);
                    if (erroEmail) setErroEmail('');
                    if (mensagem.texto) setMensagem({ texto: '', tipo: '' });
                }}
                placeholderTextColor={theme.formText} keyboardType="email-address" autoCapitalize="none"
            />
            {erroEmail ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroEmail}</Text> : null}
            <TextInput style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="Nova senha (opcional)" value={senha} onChangeText={text => { setSenha(text); if (erroSenha) setErroSenha(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText} secureTextEntry
            />
            {erroSenha ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroSenha}</Text> : null}
            <View style={styles.deleteConfig}>
                <Botao title={loading ? "Atualizando..." : "Atualizar Conta"} color={theme.button} onPress={atualizarConta} />
                <Botao title="Deletar Conta" color="#d9534f" onPress={deletarConta} />
            </View>
            <NotificationTester
                themeColors={{
                    background: theme.background,
                    card: theme.formInputBackground,
                    primary: theme.primary,
                    subtitle: theme.formText,
                    buttonBackground: '#38bdf8',
                    buttonLabel: '#0f172a',
                }}
                onSchedule={enviarNotificacaoTeste}
                statusMessage={statusAgendamento}
                lastNotification={lastNotification}
            />
        </View>
    );
};

const notificationStyles = StyleSheet.create({
    wrapper: {
        marginTop: 32,
        width: '100%',
        paddingHorizontal: 16,
    },
    card: {
        borderRadius: 24,
        paddingVertical: 32,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.25)',
        shadowColor: '#020617',
        shadowOffset: { width: 0, height: 18 },
        shadowOpacity: 0.25,
        shadowRadius: 32,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 16,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    logBox: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    logTitle: {
        fontWeight: '600',
        marginBottom: 6,
        textAlign: 'center',
    },
    logMessage: {
        textAlign: 'center',
    },
    statusMessage: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
    },
});

interface NotificationTesterProps {
    themeColors: {
        background: string;
        card: string;
        primary: string;
        subtitle: string;
        buttonBackground: string;
        buttonLabel: string;
    };
    onSchedule: () => void;
    statusMessage: string | null;
    lastNotification: Notifications.Notification | null;
}

function NotificationTester({ themeColors, onSchedule, statusMessage, lastNotification }: NotificationTesterProps) {
    return (
        <View style={notificationStyles.wrapper}>
            <View style={[notificationStyles.card, { backgroundColor: themeColors.card }]}> 
                <Text style={[notificationStyles.title, { color: themeColors.primary }]}>Teste de Notificação</Text>
                <Text style={[notificationStyles.subtitle, { color: themeColors.subtitle }]}>Dispare uma notificação local para validar o fluxo do aplicativo.</Text>
                {lastNotification ? (
                    <View style={[notificationStyles.logBox, { backgroundColor: 'rgba(56, 189, 248, 0.08)' }]}> 
                        <Text style={[notificationStyles.logTitle, { color: '#38bdf8' }]}>Última notificação recebida</Text>
                        <Text style={[notificationStyles.logMessage, { color: themeColors.subtitle }]}>{lastNotification.request.content.title}</Text>
                        <Text style={[notificationStyles.logMessage, { color: themeColors.subtitle }]}>{lastNotification.request.content.body}</Text>
                    </View>
                ) : null}
                <TouchableOpacity activeOpacity={0.85} onPress={onSchedule} style={[notificationStyles.button, { backgroundColor: themeColors.buttonBackground }]}> 
                    <Text style={[notificationStyles.buttonLabel, { color: themeColors.buttonLabel }]}>Notificar em 5 segundos</Text>
                </TouchableOpacity>
                {statusMessage ? (
                    <Text style={[notificationStyles.statusMessage, { color: statusMessage.includes('não foi') || statusMessage.includes('Não foi') ? 'red' : themeColors.primary }]}>{statusMessage}</Text>
                ) : null}
            </View>
        </View>
    );
}

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