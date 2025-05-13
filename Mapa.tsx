import React from "react";
import { View, Text } from "react-native";
import { styles } from "./estilos";
import Moto from "./Moto";


export function MapaPatio({ listaMoto }: { listaMoto: Moto[] }) {
return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
        <Text style={styles.tituloFormulario}>Mapa do Pátio</Text>
        <View style={{ flex: 1, borderWidth: 2, borderColor: "black", margin: 10, backgroundColor: "gray",}}>
            {listaMoto.map((moto, index) => (
                <View key={index} style={{ position: "absolute", left: moto.posX, top: moto.posY, width: 40, height: 40, backgroundColor: "red", borderRadius: 5, justifyContent: "center", alignItems: "center",}}>
                    <Text style={{ color: "white", fontSize: 18 }}>{moto.id}</Text>
                </View>
            ))}
        </View>
    </View>
);
}

// pendência : amarelo 
// reparo simples : azul
// danos estruturais graves : laranja
// motor defeituoso : vermelho
// agendada para manutenção : cinza
// Pronta para aluguel : verde escuro
// Sem placa : rosa
// "Minha Mottu" : verde claro
