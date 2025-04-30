import { ParamListBase, NavigationProp } from "@react-navigation/native"
import { useState } from "react"
import { Button, Text, TextInput, View } from "react-native"
import { styles } from "./estilos"

interface CadastroProps {
    navigation: NavigationProp<ParamListBase>;
    onCadastro: (nome: string, email: string, senha: string) => void;
}

const Cadastro = (props: CadastroProps) : React.ReactElement => {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:22, fontWeight: 'bold', marginTop: 32}}>Cadastro</Text>
            <View style={{flex: 1}}>
                <View style={styles.viewInput}>
                    <Text style={{marginRight: 32}}>Nome</Text>
                    <TextInput style={styles.input} value={nome} onChangeText={setNome}/>
                </View>
                <View style={styles.viewInput}>
                    <Text style={{marginRight: 32}}>Email</Text>
                    <TextInput style={styles.input} value={email} onChangeText={setEmail}/>
                </View>
                <View style={styles.viewInput}>
                    <Text style={{marginRight: 32}}>Senha</Text>
                    <TextInput style={styles.input} value={senha} onChangeText={setSenha}/>
                </View>
                <Button title="Cadastrar" onPress={()=>{
                props.onCadastro(nome, email, senha)
                props.navigation.navigate("Login")
                }} />
            </View>
        </View>
    )
}


export { Cadastro };