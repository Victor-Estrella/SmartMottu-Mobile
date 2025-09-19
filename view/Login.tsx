import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles/estilos";
import { useLoginControl } from "../control/loginControl";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginProps from "../model/LoginProps";
import { useThemeGlobal } from "../styles/ThemeContext";

const Login = (props: LoginProps) : React.ReactElement => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const { autenticar, loading, mensagem } = useLoginControl();
    const { theme } = useThemeGlobal();

    const [erroLogin, setErroLogin] = useState<string | null>(null);
    const onLogin = async () => {
        setErroLogin(null);
        try {
            const result = await autenticar(email, senha);
            if (result && result.token) {
                await AsyncStorage.setItem('TOKEN', result.token);
                if (result.email) {
                    await AsyncStorage.setItem('email', result.email);
                } else {
                    await AsyncStorage.setItem('email', email);
                }
                props.onLogin(email, senha); 
                return;
            } else {
                setErroLogin('Não foi possível autenticar. Verifique seu e-mail e senha.');
            }
        } catch (err: any) {
            let msg = 'Ocorreu um erro inesperado ao tentar fazer login.';
            if (err?.response?.status === 400) {
                msg = 'E-mail ou senha incorretos. Por favor, tente novamente.';
            } else if (err?.response?.status === 401) {
                msg = 'Acesso não autorizado. Confira suas credenciais.';
            } else if (err?.response?.status === 500) {
                msg = 'Erro interno do servidor. Tente novamente mais tarde.';
            }
            setErroLogin(msg);
        }
    };
    
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.formBackground}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.tituloAutenticacao, {color: theme.primary}]}>Login</Text>
            </View>
            <View style={{flex: 3, width: '50%'}}>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]}
                        placeholderTextColor={theme.formText} placeholder="Email" value={email} onChangeText={setEmail}
                    />
                </View>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]}
                        placeholderTextColor={theme.formText} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry/>
                </View>
                {erroLogin ? (
                    <Text style={{ color: 'red', marginBottom: 8 }}>{erroLogin}</Text>
                ) : mensagem ? (
                    <Text style={{ color: mensagem.includes('sucesso') ? theme.primary : 'red', marginBottom: 8 }}>{mensagem}</Text>
                ) : null}
                <Botao title={loading ? "Entrando..." : "Entrar"} onPress={onLogin} theme={theme} />
            </View>
        </View>
    )
}



function Botao( props : { title: string, onPress: () => void, theme: any } ) { 
    return (
        <Pressable onPress={props.onPress}>
            <View style={{borderRadius: 16, marginTop: 42, backgroundColor: props.theme.button}} >
                <Text style={[styles.buttonTextAutenticacao, {color: props.theme.buttonText}]}>
                    {props.title}
                </Text>
            </View>
        </Pressable>
    );
}

export { Login };