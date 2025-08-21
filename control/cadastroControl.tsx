import { useState } from 'react';
import { ListaCadastro } from '../model/Cadastro';
import { cadastroServicoSalvar } from '../service/cadastroService';
import { SalvarCallback } from '../fetcher/cadastroFetcher';

const useCadastroControl = () => {
  const [cadastro, setCadastro] = useState<ListaCadastro | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const salvar = (nome: string, email: string, senha: string) => {
    setLoading(true);
    const obj: ListaCadastro = { nome, email, senha } as ListaCadastro;
    cadastroServicoSalvar(obj, (sucesso, msg) => {
      setLoading(false);
      if (sucesso) {
        setMensagem('Cadastro gravado com sucesso');
        setCadastro(obj);
      } else {
        setMensagem('Erro ao gravar cadastro => ' + msg);
      }
    });
  };

  return { cadastro, setCadastro, salvar, loading, mensagem };
};

export { useCadastroControl };
