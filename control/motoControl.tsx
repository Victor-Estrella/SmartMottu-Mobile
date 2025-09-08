import { useState, useEffect } from 'react';
import { Moto } from '../model/Moto';
import { motoServicoSalvar, motoServicoListar, motoServicoAtualizar, motoServicoDeletar } from '../service/motoService';

type GravarMotoFn = (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, nmChassi: string) => void;

const useMotoControl = () => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  const gravar: GravarMotoFn = async (setor, id, modelo, unidade, status, placa, nmChassi) => {
    setLoading(true);
    const moto: Moto = { setor, id, modelo, unidade, status, placa, nmChassi };
    try {
      const result = await motoServicoSalvar(moto);
      setListaMoto(prev => [...prev, { ...moto, id: result.id || id }]);
    } catch (err: any) {
      let msg = 'Erro desconhecido ao tentar cadastrar moto.';
      if (err?.response?.status === 400) {
        msg = 'Dados inválidos. Verifique os campos e tente novamente.';
      } else if (err?.response?.status === 409) {
        msg = 'Já existe uma moto com este identificador.';
      } else if (err?.response?.status === 500) {
        msg = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const atualizar = async (key: string, motoAtualizada: Moto) => {
    setLoading(true);
    try {
      await motoServicoAtualizar(key, motoAtualizada);
      setListaMoto(prev => prev.map(m => (m.id === key ? motoAtualizada : m)));
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
      setListaMoto(prev => prev.filter(m => m.id !== key));
    } catch (err: any) {
      console.warn('Erro ao deletar moto:', err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const limpar = () => setListaMoto([]);

  return { listaMoto, gravar, deletar, atualizar, limpar, setListaMoto, loading };
};

export { useMotoControl };
