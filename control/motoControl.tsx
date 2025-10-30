import { useState, useEffect } from 'react';
import { Moto } from '../model/Moto';
import { motoServicoSalvar, motoServicoListar, motoServicoAtualizar, motoServicoDeletar } from '../service/motoService';
import { useNotification } from '../contexto/NotificationContext';
import i18n from '../i18n';

type GravarMotoFn = (setor: string, modelo: string, unidade: string, status: string, placa: string, nmChassi: string) => void;

const useMotoControl = () => {
  const [listaMoto, setListaMoto] = useState<Moto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const { sendPushNotificationAsync } = useNotification();

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
      setMensagem(i18n.t('moto.messages.createSuccess'));
      await sendPushNotificationAsync({
        title: i18n.t('notifications.moto.createdTitle'),
        body: i18n.t('notifications.moto.createdBody', {
          model: result.modelo ?? i18n.t('moto.details.labels.model'),
          sector: result.setor ?? i18n.t('moto.sectors.Outro'),
        }),
        data: {
          type: 'moto-created',
          motoId: result.idMoto ?? result.id ?? null,
          setor: result.setor ?? null,
        },
      });
    } catch (err: any) {
      let msg = i18n.t('moto.messages.unknownError');
      if (err?.response?.status === 400) {
        msg = i18n.t('moto.messages.invalidData');
      } else if (err?.response?.status === 409) {
        msg = i18n.t('moto.messages.duplicate');
      } else if (err?.response?.status === 500) {
        msg = i18n.t('moto.messages.serverError');
      }
      setMensagem(msg);
    } finally {
      setLoading(false);
    }
  };

  const atualizar = async (key: string, motoAtualizada: Moto) => {
    setLoading(true);
    try {
      const previous = listaMoto.find(m => String(m.idMoto) === String(key));
      const result = await motoServicoAtualizar(key, motoAtualizada);
      setListaMoto(prev => prev.map(m => (String(m.idMoto) === String(key) ? result : m)));
      const setorAlterado = previous && previous.setor !== result.setor;
      const statusAlterado = previous && previous.status !== result.status;
      if (setorAlterado || statusAlterado) {
        await sendPushNotificationAsync({
          title: i18n.t('notifications.moto.updatedTitle'),
          body: i18n.t('notifications.moto.updatedBody', {
            identifier: result.idMoto ?? result.placa ?? i18n.t('moto.details.labels.id'),
            sector: result.setor ?? i18n.t('moto.sectors.Outro'),
            status: result.status ?? '-',
          }),
          data: {
            type: 'moto-updated',
            motoId: result.idMoto ?? key,
            previousSetor: previous?.setor ?? null,
            newSetor: result.setor ?? null,
            previousStatus: previous?.status ?? null,
            newStatus: result.status ?? null,
          },
        });
      }
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
