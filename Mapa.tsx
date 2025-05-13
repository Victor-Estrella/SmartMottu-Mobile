import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "./estilos";
import Moto from "./Moto";
import { useWindowDimensions } from "react-native";


export function MapaPatio({ listaMoto }: { listaMoto: Moto[] }) {
    const { width } = useWindowDimensions();
    const itemWidth = 90;
    const colunas = Math.max(1, Math.floor(width / itemWidth));



    const corPorSetor: { [key: string]: string } = {
        "pendencia": "yellow",
        "reparo simples": "blue",
        "danos estruturais graves": "orange",
        "motor defeituoso": "red",
        "agendada para manutencao": "lightgray",
        "pronta para aluguel": "darkgreen",
        "sem placa": "pink",
        "minha mottu": "lightgreen",
    };

return (
    <View style={{ flex: 1, backgroundColor: "black",  }}>
        <Text style={styles.tituloFormulario}>Mapa do Pátio</Text>
        <ScrollView style={{ flex: 1, borderWidth: 2, borderColor: "black", margin: 10, backgroundColor: "gray", position: "relative" }}>
            {listaMoto.map((moto, index) => {
                const coluna = index % colunas;
                const linha = Math.floor(index / colunas);

                const posX = coluna * itemWidth + 10;
                const posY = linha * itemWidth + 10;

                const cor = corPorSetor[moto.setor.toLowerCase()] || "white";

                return (
                    <View key={index} style={{ position: "absolute", left: posX, top: posY, width: 75, height: 75, backgroundColor: cor, borderRadius: 5, justifyContent: "center", alignItems: "center",}}>
                    <Text style={{ color: "black", fontSize: 15, textAlign: "center", flexShrink: 1, }} numberOfLines={2}>{moto.placa || moto.chassi}</Text>
                    </View>
                );
            })}
        </ScrollView>
    </View>
);
}
