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
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:22, fontWeight: 'bold', marginTop: 32}}>Login</Text>
            <View style={{flex: 1}}>
                <View style={styles.viewInput}>
                    <Text style={{marginRight: 32}}>Nome</Text>
                    <TextInput style={styles.input} value={nome} onChangeText={setNome}/>
                </View>
                <View style={styles.viewInput}>
                    <Text style={{marginRight: 32}}>Senha</Text>
                    <TextInput style={styles.input} value={senha} onChangeText={setSenha}/>
                </View>
                <Botao title="Logar" onPress={()=>{
                props.onLogin(nome, senha)
                }} />
            </View>
        </View>
    )
}



function Botao( props : BotaoProps ) { 
    return (
        <Pressable onPress={props.onPress}>
            <View style={{borderRadius: 16, marginTop: 12, backgroundColor: 'black'}} >
                <Text style={styles.buttonText}>
                    {props.title}
                </Text>
            </View>
        </Pressable>
    );
}


export { Login };