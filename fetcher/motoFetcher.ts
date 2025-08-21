import { Moto } from "../model/Moto";
import axios from 'axios';

const apiBase = axios.create({
  baseURL: "https://tdsph-ad96c-default-rtdb.firebaseio.com",
});

interface MotoSalvarCallback {
  (sucesso: boolean, mensagem: string, key?: string): void;
}

interface MotoListarCallback {
  (sucesso: boolean, dados?: Moto[] | null, mensagem?: string): void;
}

const motoFetcherSalvar = (moto: Moto, callback: MotoSalvarCallback): void => {
  apiBase
    .post('/motos.json', moto)
    .then((resp) => callback(true, '', resp.data && resp.data.name ? resp.data.name : undefined))
    .catch((err: any) => callback(false, err.message || String(err)));
};

const motoFetcherListar = (callback: MotoListarCallback): void => {
  apiBase
    .get('/motos.json')
    .then((resp) => {
      const data = resp.data || {};
      const lista: Moto[] = Object.keys(data).map((k) => ({ ...(data[k] as Moto), id: (data[k] as any).id || k } as Moto));
      callback(true, lista);
    })
    .catch((err: any) => callback(false, null, err.message || String(err)));
};

const motoFetcherAtualizar = (key: string, moto: Moto, callback: MotoSalvarCallback): void => {
  apiBase
    .put(`/motos/${key}.json`, moto)
    .then(() => callback(true, ''))
    .catch((err: any) => callback(false, err.message || String(err)));
};

const motoFetcherDeletar = (key: string, callback: (sucesso: boolean, mensagem: string) => void): void => {
  apiBase
    .delete(`/motos/${key}.json`)
    .then(() => callback(true, ''))
    .catch((err: any) => callback(false, err.message || String(err)));
};

export { motoFetcherSalvar, MotoSalvarCallback, motoFetcherListar, MotoListarCallback, motoFetcherAtualizar, motoFetcherDeletar };
