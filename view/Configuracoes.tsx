import React from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { styles } from '../styles/estilos';
import { BotaoPropsConfig } from '../model/BotaoPropsConfig';
import { useThemeGlobal } from '../styles/ThemeContext';
import { useCadastroControl } from '../control/cadastroControl';

const Configuracoes = (): React.ReactElement => {
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const { theme }= useThemeGlobal();
    const { atualizar, deletar } = useCadastroControl();


    const atualizarConta = async () => {
        try {
            await atualizar(nome, email);
            Alert.alert('Conta atualizada!', 'Suas informações foram atualizadas com sucesso.');
        } catch (error) {
            Alert.alert('Erro', 'Ocorreu um erro ao atualizar a conta.');
        }
    };

    const deletarConta = () => {
        Alert.alert(
            'Deletar Conta',
            'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar', style: 'destructive', onPress: async () => {
                        try {
                            await deletar(email);
                            Alert.alert('Conta deletada', 'Sua conta foi deletada.');
                        } catch (error) {
                            Alert.alert('Erro', 'Ocorreu um erro ao deletar a conta.');
                        }
                    }
                },
            ]
        );
    };

    return (
        <View style={[styles.containerConfig, { backgroundColor: theme.background }]}> 
            <Text style={[styles.tituloConfig, { color: theme.primary }]}>Configurações da Conta</Text>
            <TextInput 
                style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="Nome" 
                value={nome} 
                onChangeText={setNome} 
                placeholderTextColor={theme.formText} 
            />
            <TextInput 
                style={[styles.inputConfig, { color: theme.formText, backgroundColor: theme.formInputBackground, borderColor: theme.primary }]}
                placeholder="E-mail" 
                value={email} 
                onChangeText={setEmail} 
                placeholderTextColor={theme.formText} 
                keyboardType="email-address" 
                autoCapitalize="none" 
            />
            <View style={styles.deleteConfig}>
                <Botao title="Atualizar Conta" color={theme.button} onPress={atualizarConta} />
                <Botao title="Deletar Conta" color="#d9534f" onPress={deletarConta} />
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