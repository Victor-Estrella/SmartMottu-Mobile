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
 - expo-notifications (Push)
 - i18next (i18n)

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

## Publicação (Firebase App Distribution)

1. Gere um build interno com EAS ou Gradle (Android):
	 - EAS: `eas build --platform android --profile development` (ou `preview`/`production`)
2. Faça upload do APK/AAB para o Firebase App Distribution.
3. Adicione o e-mail do professor como tester no projeto Firebase.
4. Garanta que a versão publicada corresponde a este repositório (hash do commit na tela Sobre).

Observações Android:
- `android/app/google-services.json` está configurado.
- Plugin do Google Services aplicado corretamente.

## Notificações Push (Expo + FCM)

- O app usa `expo-notifications` e registra o token no dispositivo físico.
- Pré-requisito: adicionar a chave de servidor do FCM no painel da Expo (Project → Credentials → Push Notifications) para o `projectId` configurado em `app.json`.
- Teste rápido: na tela Configurações, ative as notificações e envie o push de teste; ou use a Expo Notification Tool com o token exibido.
- Sem token/credencial, o app agenda uma notificação local de fallback.

## Tela "Sobre o App" e Hash do Commit

- A tela Sobre exibe `Aplicativo`, `Versão` e `Commit` de referência.
- O hash é resolvido por `app.config.js` nesta ordem: `EXPO_PUBLIC_GIT_COMMIT` → `git rev-parse --short HEAD` → `expo.extra.gitCommit` → `unknown`.
- Para fixar manualmente, definimos `expo.extra.gitCommit` em `app.json` quando necessário.

## Internacionalização (PT/ES)

- i18n com i18next, idiomas: Português e Espanhol. Persistência da escolha via AsyncStorage.
- Todas as strings de UI estão centralizadas em `i18n/locales/*.json`.

## Estilo e Tema

- Suporte a modo claro/escuro via `ThemeContext` e alternância no app.
- Estilos centralizados em `styles/` e aplicação consistente nas telas.

## Integração com API

- Camadas:
	- `fetcher/` (HTTP com Axios)
	- `service/` (validações com Yup e orquestração)
	- `control/` (regras de negócio usadas nas views)
- Funcionalidades implementadas:
	- Autenticação (Cadastro/Login/Logout)
	- Gestão de motos: CRUD completo (Create/Read/Update/Delete)
	- Validações de formulário e feedback de usuário

## Apresentação (Vídeo)

**Link do vídeo (demonstração completa):** https://youtu.be/31pi_rCvIFM

No vídeo são apresentados: navegação, CRUD de motos, autenticação, tema, i18n, notificações (registro/envio) e tela Sobre com hash.


## Vídeo de demonstração

**Link do vídeo:** https://youtu.be/31pi_rCvIFM
