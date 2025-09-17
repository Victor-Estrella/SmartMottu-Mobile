import { useState } from 'react';
import { ListaCadastro } from '../model/Cadastro';
import { cadastroServicoAtualizar, cadastroServicoSalvar, usuarioServicoDeletar } from '../service/cadastroService';

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

    const atualizar = async (key: string, usuarioAtualizado: ListaCadastro) => {
    setLoading(true);
    try {
      const result = await cadastroServicoAtualizar(key, usuarioAtualizado);
      setCadastro((prev: ListaCadastro[]) => prev.map(m => (String(m.idCadastro) === String(key) ? result : m)));
    } catch (err: any) {
      console.warn('Erro ao atualizar moto:', err.message || String(err));
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
