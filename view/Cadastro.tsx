import { useState } from "react"
import { useCadastroControl } from '../control/cadastroControl';
import { Pressable, Text, TextInput, View, ActivityIndicator } from "react-native"
import { styles } from "../styles/estilos"
import { BotaoProps } from "../model/Botao";
import CadastroProps from "../model/CadastroProps";
import { useThemeGlobal } from "../styles/ThemeContext";
import { validarEmail } from '../utils/email';
import { useTranslation } from 'react-i18next';

const Cadastro = (props: CadastroProps) : React.ReactElement => {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const { salvar, loading, mensagem } = useCadastroControl();
        const [mensagemSenha, setMensagemSenha] = useState<string | null>(null);
        const [erroNome, setErroNome] = useState<string | null>(null);
        const [erroEmail, setErroEmail] = useState<string | null>(null);
    const { theme } = useThemeGlobal();
    const { t } = useTranslation();
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.formBackground}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.tituloAutenticacao, {color: theme.primary}]}>{t('auth.signup.title')}</Text>
            </View>
            <View style={{flex: 3, width: '50%'}}>
                <View style={styles.viewInputAutenticacao}>
                        <TextInput
                            style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]}
                            placeholderTextColor={theme.formText}
                            placeholder={t('auth.signup.placeholders.name')}
                            value={nome}
                            onChangeText={(v)=>{ setNome(v); if (erroNome) setErroNome(null); }}
                        />
                        {erroNome && <Text style={{ color: 'red', marginTop: 4 }}>{erroNome}</Text>}
                </View>
                <View style={styles.viewInputAutenticacao}>    
                        <TextInput
                            style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]}
                            placeholderTextColor={theme.formText}
                            placeholder={t('auth.signup.placeholders.email')}
                            value={email}
                            onChangeText={(v)=>{ setEmail(v); if (mensagem) if (erroEmail) setErroEmail(null); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {erroEmail && <Text style={{ color: 'red', marginTop: 4 }}>{erroEmail}</Text>}
                </View>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]} placeholderTextColor={theme.formText} placeholder={t('auth.signup.placeholders.password')} value={senha}
                        onChangeText={text => {
                            setSenha(text);
                            if (text.length > 0 && text.length < 8) {
                                setMensagemSenha(t('validation.passwordMin'));
                            } else if (text.length > 15) {
                                setMensagemSenha(t('validation.passwordMax'));
                            } else {
                                setMensagemSenha(null);
                            }
                        }}
                        secureTextEntry
                    />
                    {mensagemSenha && <Text style={{ color: 'orange', marginTop: 4 }}>{mensagemSenha}</Text>}
                </View>
                <View style={{alignItems: 'center'}}>
                    <Botao title={loading ? t('auth.signup.buttonLoading') : t('auth.signup.button')} onPress={async () =>{
                            // validações do cliente
                            let hasError = false;
                            if (!nome.trim()) { setErroNome(t('validation.nameRequired')); hasError = true; }
                            if (!email.trim()) { setErroEmail(t('validation.emailRequired')); hasError = true; }
                            else if (!validarEmail(email)) { setErroEmail(t('validation.emailInvalid')); hasError = true; }
                            if (senha.length === 0) { setMensagemSenha(t('validation.passwordRequired')); hasError = true; }
                            else if (senha.length < 8) {
                            setMensagemSenha(t('validation.passwordMin'));
                                hasError = true;
                        }
                        if (senha.length > 15) {
                            setMensagemSenha(t('validation.passwordMax'));
                                hasError = true;
                        }
                            if (hasError) return;
                        const result = await salvar(nome, email, senha);
                        // Se não houve erro, navega imediatamente
                        if (result === true) {
                            props.navigation.navigate("Login");
                        }
                    }} theme={theme} />
                        {loading ? <ActivityIndicator style={{ marginTop: 12 }} color={theme.primary} /> : null}
                    {mensagem && (
                        <Text style={{color: mensagem === t('cadastro.messages.saveSuccess') ? theme.primary : 'red', marginTop: 10}}>
                            {mensagem}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    )
}


function Botao( props : BotaoProps & { theme: any } ) { 
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

export { Cadastro };