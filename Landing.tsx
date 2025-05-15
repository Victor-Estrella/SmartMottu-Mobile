import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';

export default function Landing() {
return (
    <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="dark" />

        <Text style={styles.title}>SmartMottu</Text>
        <Text style={styles.subtitle}>Plataforma Inteligente de Gestão de Pátios</Text>

        <Section icon="alert-triangle" title="O Problema">
            <Text style={styles.text}>• Motos sem placa ou com chassi encoberto.</Text>
            <Text style={styles.text}>• GPS em hibernação dificultando localização.</Text>
            <Text style={styles.text}>• Retrabalho, atrasos e insatisfação de clientes.</Text>
        </Section>

        <Section icon="check-circle" title="A Solução">
            <Text style={styles.text}>• Visão Computacional + IoT + QR Code + Mapa em tempo real.</Text>
            <Text style={styles.text}>• Localização precisa, mesmo sem placa.</Text>
        </Section>

        <Section icon="settings" title="Como Funciona">
            <Text style={styles.text}>1. Câmeras 360° capturam imagens do pátio.</Text>
            <Text style={styles.text}>2. Visão Computacional identifica motos mesmo sem placa.</Text>
            <Text style={styles.text}>3. QR Code exclusivo em cada moto permite rastreio.</Text>
            <Text style={styles.text}>4. App exibe histórico e localização em mapa interativo.</Text>
        </Section>

        <Section icon="cpu" title="Tecnologias Utilizadas">
            <Text style={styles.text}>• React Native</Text>
            <Text style={styles.text}>• TensorFlow ou PyTorch</Text>
            <Text style={styles.text}>• React Native Maps</Text>
            <Text style={styles.text}>• Expo Barcode Scanner</Text>
        </Section>

        <Text style={styles.footer}>💡 SmartMottu — Tecnologia que acelera o pátio e evita o caos.</Text>
    </ScrollView>
    );
}

function Section({ icon, title, children }) {
  return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Feather name={icon} size={20} color="#2c3e50" style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f7f9fc',
        alignItems: 'stretch'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#34495e',
        textAlign: 'center',
        marginBottom: 20,
    },
    section: {
        marginVertical: 12,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    text: {
        fontSize: 16,
        color: '#555',
        marginVertical: 2,
    },
    footer: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#2c3e50',
        fontStyle: 'italic',
    },
});
