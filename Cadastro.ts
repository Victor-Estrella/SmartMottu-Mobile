interface ListaCadastro {
    nome: string
    email: string
    senha: string
}

interface ListaLogin {
    nome: string
    senha: string
}

interface BotaoProps { 
    title : string
    onPress: () => void
}


export { ListaCadastro, ListaLogin, BotaoProps }; 