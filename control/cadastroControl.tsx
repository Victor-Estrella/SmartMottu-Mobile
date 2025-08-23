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
    } catch (err: any) {
      setMensagem('Erro ao gravar cadastro => ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return { cadastro, setCadastro, salvar, loading, mensagem };
};

export { useCadastroControl };
