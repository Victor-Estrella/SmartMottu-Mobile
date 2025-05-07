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
            <View style={{ padding: 20 }}>
                <View style={{ marginBottom: 20 }}>
                    <Botao title="Voltar" onPress={() => {
                        props.navigation.navigate("Listagem");
                    }}></Botao>
                </View>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Detalhes da Moto</Text>
                    <Text>Setor: {moto.setor}</Text>
                    <Text>ID: {moto.id}</Text>
                    <Text>Modelo: {moto.modelo}</Text>
                    <Text>Unidade: {moto.unidade}</Text>
                    <Text>Status: {moto.status}</Text>
                    <Text>Placa: {moto.placa}</Text>
                    <Text>Chassi: {moto.chassi}</Text>
                </View>
            </View>
        );
    } else {
        return (
            <Botao title="Voltar" onPress={() =>
                props.navigation.navigate("Listagem")} />
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