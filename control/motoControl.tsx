import { useState, useEffect } from 'react';
import { Moto } from '../model/Moto';
import { motoServicoSalvar, motoServicoListar, motoServicoAtualizar, motoServicoDeletar } from '../service/motoService';

type GravarMotoFn = (setor: string, modelo: string, unidade: string, status: string, placa: string, nmChassi: string) => void;

const useMotoControl = () => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  useEffect(() => {
    const fetchMotos = async () => {
      setLoading(true);
      try {
        const dados = await motoServicoListar();
        setListaMoto(dados);
      } catch (err: any) {
        console.warn('Erro ao listar motos:', err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchMotos();
  }, []);

  const gravar: GravarMotoFn = async (setor, modelo, unidade, status, placa, nmChassi) => {
    setLoading(true);
    setMensagem(null);
    const moto: Moto = { setor, modelo, unidade, status, placa, nmChassi };
    try {
      const result = await motoServicoSalvar(moto);
      setListaMoto(prev => [...prev, result]);
      setMensagem('Moto cadastrada com sucesso!');
    } catch (err: any) {
      let msg = 'Erro desconhecido ao tentar cadastrar moto.';
      if (err?.response?.status === 400) {
        msg = 'Dados inválidos. Verifique os campos e tente novamente.';
      } else if (err?.response?.status === 409) {
        msg = 'Já existe uma moto com este identificador.';
      } else if (err?.response?.status === 500) {
        msg = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      setMensagem(msg);
    } finally {
      setLoading(false);
    }
  };

  const atualizar = async (key: string, motoAtualizada: Moto) => {
    setLoading(true);
    try {
      const result = await motoServicoAtualizar(key, motoAtualizada);
      setListaMoto(prev => prev.map(m => (String(m.idMoto) === String(key) ? result : m)));
    } catch (err: any) {
      console.warn('Erro ao atualizar moto:', err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const deletar = async (key: string) => {
    setLoading(true);
    try {
      await motoServicoDeletar(key);
      setListaMoto(prev => prev.filter(m => String(m.idMoto) !== String(key)));
    } catch (err: any) {
      console.warn('Erro ao deletar moto:', err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => setListaMoto([]);

  return { listaMoto, gravar, deletar, atualizar, limpar, setListaMoto, loading, mensagem, setMensagem };
};

export { useMotoControl };
