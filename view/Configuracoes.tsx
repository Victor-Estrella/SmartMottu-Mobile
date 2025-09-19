import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../styles/estilos';
import { BotaoPropsConfig } from '../model/BotaoPropsConfig';
import { useThemeGlobal } from '../styles/ThemeContext';
import { useCadastroControl } from '../control/cadastroControl';

const Configuracoes = (): React.ReactElement => {
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [erroNome, setErroNome] = React.useState('');
    const [erroEmail, setErroEmail] = React.useState('');
    const [erroSenha, setErroSenha] = React.useState('');
    const [mensagem, setMensagem] = React.useState<{ texto: string, tipo: 'sucesso' | 'erro' | '' }>({ texto: '', tipo: '' });
    const { theme } = useThemeGlobal();
    const { atualizar, deletar, loading } = useCadastroControl();

    function validarEmail(email: string) {
        return /^\S+@\S+\.\S+$/.test(email);
    }

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
        const usuarioAtualizado: any = { nome, email };
        if (senha && senha.length >= 8) usuarioAtualizado.senha = senha;
        const resultado = await atualizar(email, usuarioAtualizado);
        if (resultado.sucesso) {
            setMensagem({ texto: resultado.mensagem, tipo: 'sucesso' });
            setSenha('');
        } else {
            setMensagem({ texto: resultado.mensagem, tipo: 'erro' });
        }
    };

    const deletarConta = () => {
        setErroEmail('');
        setMensagem({ texto: '', tipo: '' });
        if (!email.trim()) {
            setErroEmail('O e-mail é obrigatório para deletar a conta.');
            return;
        } else if (!validarEmail(email)) {
            setErroEmail('Digite um e-mail válido.');
            return;
        }
        // ...pode manter o Alert para confirmação...
    };

    return (
        <View style={[styles.containerConfig, { backgroundColor: theme.background }]}> 
            <Text style={[styles.tituloConfig, { color: theme.primary }]}>Configurações da Conta</Text>
            {mensagem.texto ? (
                <Text style={{ color: mensagem.tipo === 'sucesso' ? theme.primary : 'red', marginBottom: 10, marginLeft: 10, fontWeight: 'bold', }}>{mensagem.texto}</Text>
            ) : null}
            <TextInput
                style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="Nome"
                value={nome}
                onChangeText={text => { setNome(text); if (erroNome) setErroNome(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText}
            />
            {erroNome ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroNome}</Text> : null}
            <TextInput
                style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="E-mail"
                value={email}
                onChangeText={text => { setEmail(text); if (erroEmail) setErroEmail(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {erroEmail ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroEmail}</Text> : null}
            <TextInput
                style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="Nova senha (opcional)"
                value={senha}
                onChangeText={text => { setSenha(text); if (erroSenha) setErroSenha(''); if (mensagem.texto) setMensagem({ texto: '', tipo: '' }); }}
                placeholderTextColor={theme.formText}
                secureTextEntry
            />
            {erroSenha ? <Text style={{ color: 'red', marginLeft: 10 }}>{erroSenha}</Text> : null}
            <View style={styles.deleteConfig}>
                <Botao title={loading ? "Atualizando..." : "Atualizar Conta"} color={theme.button} onPress={atualizarConta} />
                <Botao title="Deletar Conta" color="#d9534f" onPress={deletarConta} />
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