import { ListaCadastro } from "../model/Cadastro";
import axios from 'axios';

const apiBase = axios.create({
  baseURL: "https://tdsph-ad96c-default-rtdb.firebaseio.com",
});

interface SalvarCallback {
  (sucesso: boolean, mensagem: string, key?: string): void;
}

const cadastroFetcherSalvar = (cadastro: ListaCadastro, callback: SalvarCallback): void => {
  apiBase
    .post('/cadastros.json', cadastro)
    .then((resp) => callback(true, '', resp.data && resp.data.name ? resp.data.name : undefined))
    .catch((err: any) => callback(false, err.message || String(err)));
};

export { cadastroFetcherSalvar, SalvarCallback };
