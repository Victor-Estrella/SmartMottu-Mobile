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

    const onLogin = async () => {
        try {
            const result = await autenticar(email, senha);
            if (result && result.token) {
                await AsyncStorage.setItem('TOKEN', result.token);
                props.onLogin(email, senha); 
                return;
            }
        } catch (err: any) {
            let msg = 'Erro desconhecido ao tentar logar.';
            if (err?.response?.status === 400) {
                msg = 'Usuário ou senha inválidos.';
            } else if (err?.response?.status === 401) {
                msg = 'Não autorizado. Verifique suas credenciais.';
            } else if (err?.response?.status === 500) {
                msg = 'Erro interno do servidor. Tente novamente mais tarde.';
            }
            alert(msg);
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
                {mensagem ? <Text style={{ color: mensagem.includes('sucesso') ? theme.primary : 'red', marginBottom: 8 }}>{mensagem}</Text> : null}
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