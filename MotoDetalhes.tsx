import React from 'react';
import { useRoute } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import Moto from './Moto';


interface MotoPropsExtra {
    navigation: any;
}

const MotoDetalhes = (props: MotoPropsExtra) : React.ReactElement => {
    const route = useRoute();
    const { moto } = route.params as { moto: Moto };

    return (
        <View style={{ padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
                <Button title="Voltar" onPress={() => {
                    props.navigation.navigate("Listagem");
                    }}></Button>
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
};

export default MotoDetalhes;