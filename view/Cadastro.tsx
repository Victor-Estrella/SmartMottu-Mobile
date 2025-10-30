import { useState } from "react"
import { useCadastroControl } from '../control/cadastroControl';
import { Pressable, Text, TextInput, View } from "react-native"
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
    const { theme } = useThemeGlobal();
    const { t } = useTranslation();
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.formBackground}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.tituloAutenticacao, {color: theme.primary}]}>{t('auth.signup.title')}</Text>
            </View>
            <View style={{flex: 3, width: '50%'}}>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]} placeholderTextColor={theme.formText} placeholder={t('auth.signup.placeholders.name')} value={nome} onChangeText={setNome}/>
                </View>
                <View style={styles.viewInputAutenticacao}>    
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]} placeholderTextColor={theme.formText} placeholder={t('auth.signup.placeholders.email')} value={email} onChangeText={setEmail}/>
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
                        if (senha.length < 8) {
                            setMensagemSenha(t('validation.passwordMin'));
                            return;
                        }
                        if (senha.length > 15) {
                            setMensagemSenha(t('validation.passwordMax'));
                            return;
                        }
                        if (!validarEmail(email)) {
                            setMensagemSenha(t('validation.emailInvalid'));
                            return;
                        }
                        const result = await salvar(nome, email, senha);
                        // Se não houve erro, navega imediatamente
                        if (result === true) {
                            props.navigation.navigate("Login");
                        }
                    }} theme={theme} />
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