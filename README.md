# SmartMottu

Aplicativo mobile para gestão de pátios da Mottu, com autenticação, cadastro e gestão de motos, geração de QR Code por moto, mapa do pátio e alternância de tema claro/escuro.

## Integrantes
- Julia Monteiro — RM: 557023 — Turma: 2TDSPV
- Sofia Andrade Petruk — RM: 556585 — Turma: 2TDSPV
- Victor Henrique Estrella Carracci — RM: 556206 — Turma: 2TDSPH 
## Proposta e funcionalidades
Objetivo: resolver a dificuldade de localizar motos nos pátios, especialmente quando sem placa ou com chassi encoberto, garantindo controle, rastreabilidade e produtividade.

Funcionalidades principais (todas integradas à API Java com validações, mensagens e carregamento):
- Autenticação: Cadastro, Login, Logout (persistência de token e e-mail com AsyncStorage)
- Configurações da conta: atualizar dados e deletar conta (com logout automático)
- Gestão de motos: CRUD completo (Create, Read, Update, Delete)
- QR Code por moto: gerado ao criar a moto e exibido em detalhes
- Mapa do pátio: visão geral com filtro por setor
- Tema claro/escuro com alternância global

## Estrutura de pastas
```
assets/
contexto/           # Contextos globais (ex.: MotoContext)
control/            # Hooks de controle (regras de negócio do app)
fetcher/            # Acesso HTTP (axios) à API
model/              # Tipos e Schemas (Yup)
service/            # Orquestração e validação antes do fetcher
styles/             # Temas, estilos globais e ThemeContext
utils/              # Utilitários (ex.: validação de e-mail)
view/               # Telas (UI) — sem lógica de negócio
App.tsx             # Navegação raiz e ThemeProvider
```

## Tecnologias utilizadas
- React Native (Expo)
- React Navigation (Stack/Tab)
- TypeScript + Yup
- AsyncStorage
- Axios
- react-native-qrcode-svg

## Como rodar

Pré‑requisitos
- Node.js LTS
- Expo (sem necessidade de instalar globalmente no Expo SDK 54+)
- Emulador Android/iOS ou app Expo Go no dispositivo

Clonar e instalar
```powershell
git clone https://github.com/AntonioCarvalhoFIAP/challenge-3-Victor-Estrella.git
cd challenge-3-Victor-Estrella
npm install
```

Executar (Metro bundler)
```powershell
npm run start
```

Executar no navegador (web)
```powershell
npm run web
```

Back-end
- Endpoint padrão de produção: `https://smartmottu-api.onrender.com`.
- É possível sobrescrever via variável de ambiente (PowerShell):
```powershell
$env:API_URL = "http://seu-servidor:8080"; npm run start
```


## Vídeo de demonstração

**Link do vídeo:** https://youtu.be/31pi_rCvIFM
