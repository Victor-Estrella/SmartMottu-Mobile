# SmartMottu

## Integrantes
- Julia Monteiro - RM:557023 - Turma: 2TDSPV
- Sofia Andrade Petruk - RM:556585 - Turma: 2TDSPV
- Victor Henrique Estrella Carracci - RM:556206 - Turma: 2TDSPH

## Objetivo
O objetivo deste projeto é resolver o principal problema interno da Mottu: a dificuldade de localizar motos nos pátios, especialmente quando estão paradas sem placas, com o chassi encoberto ou quando o GPS entra em modo de hibernação. Esse problema gera confusão, retrabalho, atrasos e impacta diretamente na produtividade e satisfação dos clientes.

## Solução
A solução proposta é uma plataforma inteligente de gestão de pátios que integra **visão computacional**, **IoT** e **QR Code** para localizar motos em tempo real, mesmo quando não possuem placas ou o chassi está encoberto.

### Como Funciona:
1. **Instalação de Câmeras 360°**: Câmeras são instaladas nos pátios para capturar imagens contínuas do ambiente.
2. **Processamento de Imagens com Visão Computacional**: As imagens capturadas são processadas por um sistema de visão computacional treinado com fotos cadastradas das motos. Isso permite a identificação visual das unidades, mesmo sem placas.
3. **QR Code Exclusivo**: Cada moto tem um QR Code exclusivo gerado e fixado. Ao escanear o QR Code com o app, o operador pode visualizar o histórico e status da moto, além de registrar movimentações.
4. **Mapeamento em Tempo Real**: O sistema utiliza **React Native** e **React Native Maps** para criar um mapa interativo que exibe a localização das motos em tempo real.
5. **Busca e Identificação Visual**: O operador pode buscar por uma moto utilizando imagens capturadas pelas câmeras e o sistema de visão computacional (baseado em **TensorFlow** ou **PyTorch**). O sistema indicará a localização exata da moto, convertendo coordenadas de imagem para pontos no mapa digital.

## Tecnologias Utilizadas:
- **React Native** para o desenvolvimento do app mobile.
- **TensorFlow** ou **PyTorch** para a implementação de visão computacional.
- **React Native Maps** para exibição do mapa interativo.
- **Expo Barcode Scanner** para leitura do QR Code.

## Como Rodar o Projeto

### Pré-requisitos
- **Node.js** instalado
- **Expo CLI** instalado: `npm install -g expo-cli`
- **React Native** configurado no seu ambiente de desenvolvimento

### Ao clonar o projeto
- **Entrar no diretório**: `cd challenge-mobile` caso esteja fora dessa pasta
- **Node Modules** `npm install` para baixar todos os arquivos da node_modules
- **Rodar o projeto**: `npm run start` caso queira abrir atráves de um emulador ou `npm run web` caso queira abrir direto do navegador