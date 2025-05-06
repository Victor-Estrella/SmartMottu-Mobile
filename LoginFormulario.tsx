import { NavigationProp, ParamListBase } from "@react-navigation/native"
import { useState } from "react"
import { Button, Pressable, Text, TextInput, View } from "react-native"
import { styles } from "./estilos"
import { BotaoProps } from "./Cadastro";


interface LoginProps {
    navigation: NavigationProp<ParamListBase>;
    onLogin : (nome : string, senha: string) => void
}

const Login = (props: LoginProps) : React.ReactElement => {
    const [nome, setNome] = useState("")
    const [senha, setSenha] = useState("")
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.tituloAutenticacao}>Login</Text>
            </View>
            <View style={{flex: 3, alignItems: 'center'}}>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={styles.inputAutenticacao} placeholderTextColor='white' placeholder="Nome" value={nome} onChangeText={setNome}/>
                </View>
                <View style={styles.viewInputAutenticacao}>
                    <TextInput style={styles.inputAutenticacao} placeholderTextColor='white' placeholder="Senha" value={senha} onChangeText={setSenha}/>
                </View>
                <Botao title="Entrar" onPress={()=>{
                props.onLogin(nome, senha)
                }} />
            </View>
        </View>
    )
}



function Botao( props : BotaoProps ) { 
    return (
        <Pressable onPress={props.onPress}>
            <View style={{borderRadius: 16, marginTop: 42, backgroundColor: 'green'}} >
                <Text style={styles.buttonTextAutenticacao}>
                    {props.title}
                </Text>
            </View>
        </Pressable>
    );
}


export { Login };