import { useState } from "react"
import { useCadastroControl } from '../control/cadastroControl';
import { Pressable, Text, TextInput, View } from "react-native"
import { styles } from "../styles/estilos"
import { BotaoProps } from "../model/Botao";
import CadastroProps from "../model/CadastroProps";
import { useThemeGlobal } from "../styles/ThemeContext";
import { validarEmail } from '../utils/email';

const Cadastro = (props: CadastroProps) : React.ReactElement => {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const { salvar, loading, mensagem } = useCadastroControl();
    const [mensagemSenha, setMensagemSenha] = useState<string | null>(null);
    const { theme } = useThemeGlobal();
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.formBackground}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={[styles.tituloAutenticacao, {color: theme.primary}]}>Cadastro</Text>
            </View>
            <View style={{flex: 3, width: '50%'}}>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]} placeholderTextColor={theme.formText} placeholder="Nome" value={nome} onChangeText={setNome}/>
                </View>
                <View style={styles.viewInputAutenticacao}>    
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]} placeholderTextColor={theme.formText} placeholder="Email" value={email} onChangeText={setEmail}/>
                </View>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={[styles.inputAutenticacao, {color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary}]} placeholderTextColor={theme.formText} placeholder="Senha" value={senha}
                        onChangeText={text => {
                            setSenha(text);
                            if (text.length > 0 && text.length < 8) {
                                setMensagemSenha('A senha deve ter pelo menos 8 caracteres.');
                            } else if (text.length > 15) {
                                setMensagemSenha('A senha deve ter no máximo 15 caracteres.');
                            } else {
                                setMensagemSenha(null);
                            }
                        }}
                        secureTextEntry
                    />
                    {mensagemSenha && <Text style={{ color: 'orange', marginTop: 4 }}>{mensagemSenha}</Text>}
                </View>
                <View style={{alignItems: 'center'}}>
                    <Botao title={loading ? "Salvando..." : "Cadastrar"} onPress={async ()=>{
                        if (senha.length < 8) {
                            setMensagemSenha('A senha deve ter pelo menos 8 caracteres.');
                            return;
                        }
                        if (senha.length > 15) {
                            setMensagemSenha('A senha deve ter no máximo 15 caracteres.');
                            return;
                        }
                        if (!validarEmail(email)) {
                            setMensagemSenha('Digite um e-mail válido.');
                            return;
                        }
                        const result = await salvar(nome, email, senha);
                        // Se não houve erro, navega imediatamente
                        if (result === true) {
                            props.navigation.navigate("Login");
                        }
                    }} theme={theme} />
                    {mensagem && <Text style={{color: mensagem.includes('sucesso') ? theme.primary : 'red', marginTop: 10}}>{mensagem}</Text>}
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