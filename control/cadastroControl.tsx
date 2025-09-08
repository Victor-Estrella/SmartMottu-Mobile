import { useState } from 'react';
import { ListaCadastro } from '../model/Cadastro';
import { cadastroServicoSalvar } from '../service/cadastroService';

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

  return { cadastro, setCadastro, salvar, loading, mensagem };
};

export { useCadastroControl };
