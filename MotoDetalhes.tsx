import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { BotaoProps } from './Cadastro';
import { styles } from './estilos';
import Moto from './Moto';


interface MotoPropsExtra {
    navigation: any;
}

const MotoDetalhes = (props: MotoPropsExtra) => {
    const route = useRoute();
    if (route.params !== undefined) {
        const { moto } = route.params as { moto: Moto };
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'black'}}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'green', marginTop: 30 }}>Detalhes da Moto</Text>
                <View style={{ marginTop: 20, backgroundColor: 'black' }}>
                    <Text style={{color: 'white'}}>Setor: {moto.setor}</Text>
                    <Text style={{color: 'white'}}>ID: {moto.id}</Text>
                    <Text style={{color: 'white'}}>Modelo: {moto.modelo}</Text>
                    <Text style={{color: 'white'}}>Unidade: {moto.unidade}</Text>
                    <Text style={{color: 'white'}}>Status: {moto.status}</Text>
                    <Text style={{color: 'white'}}>Placa: {moto.placa}</Text>
                    <Text style={{color: 'white'}}>Chassi: {moto.chassi}</Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Text style={{ color: 'white', fontSize: 18, marginBottom: 30 }}>Nenhuma moto selecionada</Text>
                <Botao title="Voltar" onPress={() => props.navigation.navigate("Listagem")} />
            </View>
        )
    }
};

function Botao(props: BotaoProps) {
    return (
        <Pressable onPress={props.onPress}>
            <View style={{ borderRadius: 16, backgroundColor: 'green' }}>
                <Text style={styles.botaoTexto}>
                    {props.title}
                </Text>
            </View>
        </Pressable>
    );
}

export default MotoDetalhes;