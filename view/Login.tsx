import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { styles } from "../styles/estilos";
import { useLoginControl } from "../control/loginControl";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginProps from "../model/LoginProps";
import { useThemeGlobal } from "../styles/ThemeContext";
import { validarEmail } from '../utils/email';
import { useTranslation } from 'react-i18next';

const Login = (props: LoginProps) : React.ReactElement => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const { autenticar, loading, mensagem } = useLoginControl();
    const { theme } = useThemeGlobal();
    const { t } = useTranslation();

    const [erroLogin, setErroLogin] = useState<string | null>(null);
    const [erroEmail, setErroEmail] = useState<string | null>(null);
    const [erroSenha, setErroSenha] = useState<string | null>(null);
    const onLogin = async () => {
        setErroLogin(null);
        setErroEmail(null);
        setErroSenha(null);
        // validações do cliente
        let hasError = false;
        if (!email.trim()) { setErroEmail(t('validation.emailRequired')); hasError = true; }
        else if (!validarEmail(email)) { setErroEmail(t('validation.emailInvalid')); hasError = true; }
        if (!senha.trim()) { setErroSenha(t('validation.passwordRequired')); hasError = true; }
        if (hasError) return;
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
                setErroLogin(t('validation.passwordConfirm'));
            }
        } catch (err: any) {
            let msg = t('auth.login.errors.unknown');
            if (err?.response?.status === 400) {
                msg = t('auth.login.errors.badCredentials');
            } else if (err?.response?.status === 401) {
                msg = t('auth.login.errors.unauthorized');
            } else if (err?.response?.status === 500) {
                msg = t('auth.login.errors.server');
            }
            setErroLogin(msg);
        }
    };
    
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.formBackground}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.tituloAutenticacao, {color: theme.primary}]}>{t('auth.login.title')}</Text>
            </View>
            <View style={{flex: 3, width: '50%'}}>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]}
                        placeholderTextColor={theme.formText} placeholder={t('auth.login.placeholders.email')} value={email} onChangeText={setEmail}
                    />
                </View>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]}
                        placeholderTextColor={theme.formText} placeholder={t('auth.login.placeholders.password')} value={senha} onChangeText={setSenha} secureTextEntry/>
                </View>
                {erroEmail ? (
                    <Text style={{ color: 'red', marginBottom: 8 }}>{erroEmail}</Text>
                ) : null}
                {erroSenha ? (
                    <Text style={{ color: 'red', marginBottom: 8 }}>{erroSenha}</Text>
                ) : null}
                {erroLogin ? (
                    <Text style={{ color: 'red', marginBottom: 8 }}>{erroLogin}</Text>
                ) : mensagem ? (
                    <Text style={{ color: mensagem === t('login.messages.success') ? theme.primary : 'red', marginBottom: 8 }}>{mensagem}</Text>
                ) : null}
                <Botao title={loading ? t('auth.login.buttonLoading') : t('auth.login.button')} onPress={onLogin} theme={theme} />
                {loading ? <ActivityIndicator style={{ marginTop: 12 }} color={theme.primary} /> : null}
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