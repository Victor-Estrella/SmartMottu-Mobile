import { useState } from 'react';
import { ListaCadastro } from '../model/Cadastro';
import { cadastroServicoAtualizar, cadastroServicoSalvar, usuarioServicoDeletar } from '../service/cadastroService';
import { buscarUsuarioPorEmail } from '../fetcher/cadastroFetcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const useCadastroControl = () => {
  const [cadastro, setCadastro] = useState<ListaCadastro | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const salvar = async (nome: string, email: string, senha: string) => {
    setLoading(true);
    setMensagem(null);
    const obj: ListaCadastro = { nome, email, senha };
    try {
      await cadastroServicoSalvar(obj);
      setMensagem(i18n.t('cadastro.messages.saveSuccess'));
      setCadastro(obj);
      return true;
    } catch (err: any) {
      // Mapeia erros de validação (Yup)
      if (err?.name === 'ValidationError') {
        const path = err?.path as string | undefined;
        let msg = i18n.t('cadastro.messages.unknown');
        if (path === 'nome') msg = i18n.t('validation.nameRequired');
        else if (path === 'email') msg = i18n.t('validation.emailInvalid');
        else if (path === 'senha') {
          // Validações de senha: required/min/max
          const text: string = String(err.message || '');
          if (text.includes('no máximo') || text.includes('max')) msg = i18n.t('validation.passwordMax');
          else if (text.includes('pelo menos') || text.includes('min')) msg = i18n.t('validation.passwordMin');
          else msg = i18n.t('validation.passwordRequired');
        }
        setMensagem(msg);
        return false;
      }
      let msg = i18n.t('cadastro.messages.unknown');
      if (err?.response?.status === 400) {
        msg = i18n.t('cadastro.messages.invalidData');
      } else if (err?.response?.status === 409) {
        msg = i18n.t('cadastro.messages.duplicate');
      } else if (err?.response?.status === 500) {
        msg = i18n.t('cadastro.messages.serverError');
      }
      setMensagem(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

    const atualizar = async (_: string, usuarioAtualizado: ListaCadastro) => {
      setLoading(true);
      setMensagem(null);
      try {
        // Busca o id do usuário pelo email salvo no AsyncStorage (sempre atualizado)
        const email = await AsyncStorage.getItem('email');
        let id = null;
        if (email) {
          try {
            const usuario = await buscarUsuarioPorEmail(email);
            if (usuario && usuario.idUsuario) id = usuario.idUsuario;
          } catch (e) {
            id = null;
          }
        }
        if (!id) {
          const notFoundMsg = i18n.t('validation.userIdMissing');
          setMensagem(notFoundMsg);
          return { sucesso: false, mensagem: notFoundMsg };
        }
        const result = await cadastroServicoAtualizar(String(id), usuarioAtualizado);
        setCadastro(result);
        const successMsg = i18n.t('settings.messages.updateSuccess');
        setMensagem(successMsg);
        // Se o usuário mudou o e-mail, atualize o AsyncStorage
        if (usuarioAtualizado.email) {
          await AsyncStorage.setItem('email', usuarioAtualizado.email);
        }
        return { sucesso: true, mensagem: successMsg };
      } catch (err: any) {
        if (err?.name === 'ValidationError') {
          const path = err?.path as string | undefined;
          let msg = i18n.t('settings.messages.updateError');
          if (path === 'nome') msg = i18n.t('validation.nameRequired');
          else if (path === 'email') msg = i18n.t('validation.emailInvalid');
          else if (path === 'senha') {
            const text: string = String(err.message || '');
            if (text.includes('no máximo') || text.includes('max')) msg = i18n.t('validation.passwordMax');
            else if (text.includes('pelo menos') || text.includes('min')) msg = i18n.t('validation.passwordMin');
            else msg = i18n.t('validation.passwordRequired');
          }
          setMensagem(msg);
          return { sucesso: false, mensagem: msg };
        }
        let msg = i18n.t('settings.messages.updateError');
        if (err?.response?.status === 400) {
          msg = i18n.t('cadastro.messages.invalidData');
        } else if (err?.response?.status === 404) {
          msg = i18n.t('cadastro.messages.userNotFound');
        } else if (err?.response?.status === 409) {
          msg = i18n.t('cadastro.messages.emailInUse');
        } else if (err?.response?.status === 500) {
          msg = i18n.t('cadastro.messages.serverError');
        }
        setMensagem(msg);
        return { sucesso: false, mensagem: msg };
      } finally {
        setLoading(false);
      }
    };

  const deletar = async (key: string) => {
    setLoading(true);
    try {
      await usuarioServicoDeletar(key);
      setCadastro(null);
      setMensagem(i18n.t('cadastro.messages.deleteSuccess'));
    } catch (err: any) {
      let msg = i18n.t('cadastro.messages.deleteError');
      if (err?.response?.status === 404) {
        msg = i18n.t('cadastro.messages.deleteNotFound');
      } else if (err?.response?.status === 500) {
        msg = i18n.t('cadastro.messages.deleteServerError');
      }
      setMensagem(msg);
      console.warn('Erro ao deletar cadastro:', err.message || String(err));
    } finally {
      setLoading(false);
    }
  };


  return { cadastro, setCadastro, salvar, atualizar, deletar, loading, mensagem };
};

export { useCadastroControl };
