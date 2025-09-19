import { useState, useEffect } from 'react';
import { ListaCadastro } from '../model/Cadastro';
import { cadastroServicoAtualizar, cadastroServicoSalvar, usuarioServicoDeletar } from '../service/cadastroService';
import { buscarUsuarioPorEmail } from '../fetcher/cadastroFetcher';


import AsyncStorage from '@react-native-async-storage/async-storage';

const useCadastroControl = () => {
  const [cadastro, setCadastro] = useState<ListaCadastro | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  // Carrega o idUsuario salvo ao iniciar
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('idUsuario');
      if (id) setIdUsuario(Number(id));
    })();
  }, []);

  const salvar = async (nome: string, email: string, senha: string) => {
    setLoading(true);
    setMensagem(null);
    const obj: ListaCadastro = { nome, email, senha };
    try {
      await cadastroServicoSalvar(obj);
      setMensagem('Cadastro gravado com sucesso');
      setCadastro(obj);
      return true;
    } catch (err: any) {
      let msg = 'Erro desconhecido ao tentar cadastrar.';
      if (err?.response?.status === 400) {
        msg = 'Dados inválidos. Verifique os campos e tente novamente.';
      } else if (err?.response?.status === 409) {
        msg = 'Já existe um usuário com este email.';
      } else if (err?.response?.status === 500) {
        msg = 'Erro interno do servidor. Tente novamente mais tarde.';
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
        let id = idUsuario;
        if (!id) {
          // Tenta buscar do AsyncStorage se não estiver no estado
          const idStr = await AsyncStorage.getItem('idUsuario');
          if (idStr) id = Number(idStr);
        }
        if (!id) {
          setMensagem('ID do usuário não encontrado. Faça login novamente.');
          return { sucesso: false, mensagem: 'ID do usuário não encontrado. Faça login novamente.' };
        }
  const result = await cadastroServicoAtualizar(String(id), usuarioAtualizado);
        setCadastro(result);
        setMensagem('Conta atualizada com sucesso!');
        // Se o usuário mudou o e-mail, pode ser interessante atualizar o AsyncStorage também
        if (usuarioAtualizado.email) {
          await AsyncStorage.setItem('emailUsuario', usuarioAtualizado.email);
        }
        return { sucesso: true, mensagem: 'Conta atualizada com sucesso!' };
      } catch (err: any) {
        let msg = 'Erro desconhecido ao atualizar.';
        if (err?.response?.status === 400) {
          msg = 'Dados inválidos. Verifique os campos e tente novamente.';
        } else if (err?.response?.status === 404) {
          msg = 'Usuário não encontrado.';
        } else if (err?.response?.status === 409) {
          msg = 'Já existe um usuário com este email.';
        } else if (err?.response?.status === 500) {
          msg = 'Erro interno do servidor. Tente novamente mais tarde.';
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
      setMensagem('Cadastro deletado com sucesso');
    } catch (err: any) {
      let msg = 'Erro ao deletar cadastro.';
      if (err?.response?.status === 404) {
        msg = 'Cadastro não encontrado.';
      } else if (err?.response?.status === 500) {
        msg = 'Erro interno do servidor ao deletar.';
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
