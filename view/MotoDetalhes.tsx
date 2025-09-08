import { useRoute } from '@react-navigation/native';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { BotaoProps } from '../model/Botao';
import { styles } from '../styles/estilos';
import { Moto } from '../model/Moto';

interface MotoDetalhesProps {
    navigation: any;
    listaMoto: Moto[];
    setListaMoto: React.Dispatch<React.SetStateAction<Moto[]>>;
}

const MotoDetalhes = ({ navigation, listaMoto, setListaMoto }: MotoDetalhesProps) => {
    const route = useRoute();
    if (route.params !== undefined) {
        const { moto } = route.params as { moto: Moto };

        const deletarMoto = () => {
            const novaLista = listaMoto.filter(item => item.idMoto !== moto.idMoto);
            setListaMoto(novaLista);
            Alert.alert("Sucesso", "Moto deletada com sucesso!");
            navigation.navigate("Listagem");
        };
        return (
            <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'black'}}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'green', marginTop: 30 }}>Detalhes da Moto</Text>
                <View style={{ marginTop: 20, backgroundColor: 'black' }}>
                    <Text style={{color: 'white'}}>Setor: {moto.setor}</Text>
                    <Text style={{color: 'white'}}>ID: {moto.idMoto}</Text>
                    <Text style={{color: 'white'}}>Modelo: {moto.modelo}</Text>
                    <Text style={{color: 'white'}}>Unidade: {moto.unidade}</Text>
                    <Text style={{color: 'white'}}>Status: {moto.status}</Text>
                    <Text style={{color: 'white'}}>Placa: {moto.placa}</Text>
                    <Text style={{color: 'white'}}>Chassi: {moto.nmChassi}</Text>
                    <View style={{ marginTop: 20 }}>
                        <Botao title="Atualizar" onPress={() => navigation.navigate("MotoAtualizar", { moto })} />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Botao title="Deletar" onPress={deletarMoto} />
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Text style={{ color: 'white', fontSize: 18, marginBottom: 30 }}>Nenhuma moto selecionada</Text>
                <Botao title="Voltar" onPress={() => navigation.navigate("Listagem")} />
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
