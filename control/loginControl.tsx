import { useState } from 'react';
import { ListaLogin } from '../model/Login';
import { loginServico } from '../service/loginService';
import i18n from '../i18n';

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
            setMensagem(i18n.t('login.messages.success'));
            setLogin(obj);
            return result;
        } catch (err: any) {
            let msg = i18n.t('login.messages.unknown');
            if (err?.response?.status === 400) {
                msg = i18n.t('login.messages.invalid');
            } else if (err?.response?.status === 401) {
                msg = i18n.t('login.messages.unauthorized');
            } else if (err?.response?.status === 500) {
                msg = i18n.t('login.messages.serverError');
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
