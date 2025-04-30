import { NavigationProp, ParamListBase } from "@react-navigation/native"
import { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"
import { styles } from "./estilos"


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
                <Button title="Logar" onPress={()=>{
                props.onLogin(nome, senha)
                props.navigation.navigate("MotoFormulario")
                }} />
            </View>
        </View>
    )
}


export { Login };