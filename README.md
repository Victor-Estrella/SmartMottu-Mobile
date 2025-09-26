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
- A API Java deve estar rodando em `http://localhost:8080` (padrão já usado no app).
- Opcionalmente, defina outra URL antes de iniciar (PowerShell):
```powershell
$env:API_URL = "http://seu-servidor:8080"; npm run start
```

## Critérios atendidos (guia da sprint)
- Telas funcionais com API: CRUD de usuários e motos com validações, feedback e loaders
- Sistema de login: telas de Login/Cadastro, token/e-mail no AsyncStorage e logout funcional
- Tema: alternância claro/escuro global via ThemeContext
- Arquitetura: separação por camadas (view/control/service/fetcher/contexto/model/styles/utils), código limpo e tipado
- Documentação: este README cobre nome, proposta, funcionalidades e estrutura de pastas; seção de vídeo abaixo

## Vídeo de demonstração


---

## Notas técnicas
- As validações de formulário são feitas com Yup e validações de e‑mail centralizadas em `utils/email.ts`.
- O QR Code é gerado com `react-native-qrcode-svg` e o texto fonte é definido ao criar a moto.
- O fluxo de exclusão de conta dispara o mesmo logout do botão "Sair" para consistência de UX.
