import React from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../styles/estilos';
import { BotaoPropsConfig } from '../model/BotaoPropsConfig';

const Configuracoes = (): React.ReactElement => {
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');

    const atualizarConta = () => {
        // Código para atualizar os dados do usuário
        Alert.alert('Conta atualizada!', 'Suas informações foram atualizadas com sucesso.');
    };

    const deletarConta = () => {
        Alert.alert(
            'Deletar Conta',
            'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar', style: 'destructive', onPress: () => {
                        // Código para deletar a conta do usuário
                        Alert.alert('Conta deletada', 'Sua conta foi deletada.');
                    }
                },
            ]
        );
    };

    return (
        <View style={styles.containerConfig}>
            <Text style={styles.tituloConfig}>Configurações da Conta</Text>
            <TextInput style={styles.inputConfig} placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor="white" />
            <TextInput style={styles.inputConfig} placeholder="E-mail" value={email} onChangeText={setEmail} placeholderTextColor="white" keyboardType="email-address" autoCapitalize="none" />
            <View style={styles.deleteConfig}>
                <Botao title="Atualizar Conta" color='#0CB0E7FF' onPress={atualizarConta} />
                <Botao title="Deletar Conta" color='#d9534f' onPress={deletarConta} />
            </View>
        </View>
    );
};


function Botao(props: BotaoPropsConfig) {
    return (
        <Pressable onPress={props.onPress}>
            <View style={{backgroundColor: props.color, borderRadius: 16, marginHorizontal: 12 }}>
                <Text style={styles.botaoTexto}>{props.title}</Text>
            </View>
        </Pressable>
    );
}

export default Configuracoes;