import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { styles } from './estilos';

const Configuracoes = (): React.ReactElement => {
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');

    const atualizarConta = () => {
        // Aqui você faria a chamada para atualizar os dados do usuário
        Alert.alert('Conta atualizada!', 'Suas informações foram atualizadas com sucesso.');
    };

    const deletarConta = () => {
        Alert.alert(
            'Deletar Conta',
            'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: () => {
                        // Aqui você faria a chamada para deletar a conta do usuário
                        Alert.alert('Conta deletada', 'Sua conta foi deletada.');
                    }
                },
            ]
        );
    };

    return (
        <View style={styles.containerConfig}>
            <Text style={styles.tituloConfig}>Configurações da Conta</Text>
            <TextInput style={styles.inputConfig} placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor="white"/>
            <TextInput style={styles.inputConfig} placeholder="E-mail" value={email} onChangeText={setEmail} placeholderTextColor="white" keyboardType="email-address" autoCapitalize="none"/>
            <Button title="Atualizar Conta" onPress={atualizarConta} />
            <View style={styles.deleteConfig}>
                <Button title="Deletar Conta" color="#d9534f" onPress={deletarConta}/>
            </View>
        </View>
    );
};


export default Configuracoes;