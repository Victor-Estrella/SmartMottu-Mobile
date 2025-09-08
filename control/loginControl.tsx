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
            setMensagem('Erro ao realizar login => ' + (err.message || String(err)));
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { login, setLogin, autenticar, loading, mensagem };
};

export { useLoginControl };
