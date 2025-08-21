import { FC } from 'react';
import {View, Text, TextInput, Button, Modal, ActivityIndicator} from 'react-native';
import { useContatoControl } from '../control/contatoControl';

interface ContatoViewProps {}

const ContatoView: FC<ContatoViewProps> = ( props ) => {
    const {loading, mensagem, salvar, contato, handleContato} = useContatoControl();
    return (
        <View style={{flex: 1}}>
            <Text>Nome: </Text>
            <TextInput value={(contato as any).nome} 
                onChangeText={(txt : string) => handleContato(txt, "nome")}/>
            <Text>Telefone: </Text>
            <TextInput value={(contato as any).telefone} 
                onChangeText={(txt : string) => handleContato(txt, "telefone")}/>
            <Text>Email: </Text>
            <TextInput value={(contato as any).email} 
                onChangeText={(txt : string) => handleContato(txt, "email")}/>
            <Button title="Salvar" onPress={salvar}/>
            <Text style={{color: "red", fontSize: 24}}>{mensagem}</Text>
            <Modal visible={loading} transparent={false}>
                <ActivityIndicator/>
            </Modal>
        </View>
    );
}

export { ContatoView };
