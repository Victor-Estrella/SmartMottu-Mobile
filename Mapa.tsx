import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
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

    const legenda: { setor: string; cor: string; label: string }[] = [
        { setor: "pendencia", cor: "yellow", label: "Pendência" },
        { setor: "reparo simples", cor: "blue", label: "Reparo Simples" },
        { setor: "danos estruturais graves", cor: "orange", label: "Danos Estruturais Graves" },
        { setor: "motor defeituoso", cor: "red", label: "Motor Defeituoso" },
        { setor: "agendada para manutencao", cor: "lightgray", label: "Agendada para Manutenção" },
        { setor: "pronta para aluguel", cor: "darkgreen", label: "Pronta para Aluguel" },
        { setor: "sem placa", cor: "pink", label: "Sem Placa" },
        { setor: "minha mottu", cor: "lightgreen", label: "Minha Mottu" },
        { setor: "outro", cor: "white", label: "Outro" },
    ];

    const [filtro, setFiltro] = useState<string | null>(null);

    const motosFiltradas = filtro
        ? listaMoto.filter(m => m.setor.toLowerCase() === filtro)
        : listaMoto;

    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            <Text style={styles.tituloFormulario}>Mapa do Pátio</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 10, justifyContent: "center" }}>
                {legenda.map(item => (
                    <Pressable key={item.setor} onPress={() => setFiltro(filtro === item.setor ? null : item.setor)} style={{ flexDirection: "row", alignItems: "center", margin: 5, opacity: filtro && filtro !== item.setor ? 0.5 : 1,}}>
                        <View style={{ width: 20, height: 20, backgroundColor: item.cor, borderRadius: 4, marginRight: 6, borderWidth: filtro === item.setor ? 2 : 1, borderColor: filtro === item.setor ? "white" : "gray",}} />
                        <Text style={{ color: "white", fontSize: 14 }}>{item.label}</Text>
                    </Pressable>
                ))}
            </View>
            <ScrollView style={{ flex: 1, borderWidth: 2, borderColor: "black", margin: 10, backgroundColor: "gray", }} contentContainerStyle={{ position: "relative", minHeight: 300 }}>
                {motosFiltradas.map((moto, index) => {
                    const coluna = index % colunas;
                    const linha = Math.floor(index / colunas);

                    const posX = coluna * itemWidth + 10;
                    const posY = linha * itemWidth + 10;

                    const cor = corPorSetor[moto.setor.toLowerCase()] || "white";

                    return (
                        <View key={index} style={{ position: "absolute", left: posX, top: posY, width: 75, height: 75, backgroundColor: cor, borderRadius: 5, justifyContent: "center", alignItems: "center",}}>
                            <Text style={{ color: "black", fontSize: 15, textAlign: "center", flexShrink: 1,}} numberOfLines={2}>{moto.placa || moto.chassi}</Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
