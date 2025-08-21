import { useState, useEffect } from 'react';
import { Moto } from '../model/Moto';
import { motoServicoSalvar, motoServicoListar, motoServicoAtualizar, motoServicoDeletar } from '../service/motoService';

type GravarMotoFn = (setor: string, id: string, modelo: string, unidade: string, status: string, placa: string, chassi: string) => void;

const useMotoControl = () => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    motoServicoListar((sucesso, dados, mensagem) => {
      if (sucesso && dados) {
        setListaMoto(dados);
      } else {
        console.warn('Erro ao listar motos:', mensagem);
      }
      setLoading(false);
    });
  }, []);

  const gravar: GravarMotoFn = (setor, id, modelo, unidade, status, placa, chassi) => {
    setLoading(true);
    const moto: Moto = { setor, id, modelo, unidade, status, placa, chassi } as Moto;
    motoServicoSalvar(moto, (sucesso, mensagem, key) => {
      setLoading(false);
      if (sucesso) {
        const nova = { ...moto } as Moto;
        if (key) nova.id = key;
        setListaMoto(prev => [...prev, nova]);
      } else {
        console.warn('Erro ao salvar moto:', mensagem);
      }
    });
  };

  const atualizar = (key: string, motoAtualizada: Moto) => {
    setLoading(true);
    motoServicoAtualizar(key, motoAtualizada, (sucesso, mensagem) => {
      setLoading(false);
      if (sucesso) {
        setListaMoto(prev => prev.map(m => (m.id === key ? motoAtualizada : m)));
      } else {
        console.warn('Erro ao atualizar moto:', mensagem);
      }
    });
  };

  const deletar = (key: string) => {
    setLoading(true);
    motoServicoDeletar(key, (sucesso, mensagem) => {
      setLoading(false);
      if (sucesso) {
        setListaMoto(prev => prev.filter(m => m.id !== key));
      } else {
        console.warn('Erro ao deletar moto:', mensagem);
      }
    });
  };

  const limpar = () => setListaMoto([]);

  return { listaMoto, gravar, deletar, atualizar, limpar, setListaMoto, loading };
};

export { useMotoControl };
