import { useState } from 'react';
import { ListaLogin } from '../model/Login';
import { loginServico } from '../service/loginService';

const useLoginControl = () => {
    const [login, setLogin] = useState<ListaLogin | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [mensagem, setMensagem] = useState<string | null>(null);

    const autenticar = async (email: string, senha: string) => {
        setLoading(true);
        setMensagem(null);
        const obj: ListaLogin = { email, senha };
        try {
            const result = await loginServico(obj);
            setMensagem('Login realizado com sucesso');
            setLogin(obj);
            return result;
        } catch (err: any) {
            let msg = 'Erro desconhecido ao tentar logar.';
            if (err?.response?.status === 400) {
                msg = 'Usuário ou senha inválidos.';
            } else if (err?.response?.status === 401) {
                msg = 'Não autorizado. Verifique suas credenciais.';
            } else if (err?.response?.status === 500) {
                msg = 'Erro interno do servidor. Tente novamente mais tarde.';
            }
            setMensagem(msg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, setLogin, autenticar, loading, mensagem };
};

export { useLoginControl };
