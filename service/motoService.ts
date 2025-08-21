import { Moto, motoSchema } from "../model/Moto";
import { motoFetcherSalvar, MotoSalvarCallback, motoFetcherListar, MotoListarCallback, motoFetcherAtualizar, motoFetcherDeletar } from "../fetcher/motoFetcher";

const motoServicoSalvar = (moto: Moto, callback: MotoSalvarCallback): void => {
  // validar com schema se disponível
  if (motoSchema && motoSchema.validate) {
    motoSchema.validate(moto)
      .then(() => motoFetcherSalvar(moto, callback))
      .catch((errors: any) => callback(false, errors.message || String(errors)));
  } else {
    motoFetcherSalvar(moto, callback);
  }
};

const motoServicoListar = (callback: MotoListarCallback): void => {
  motoFetcherListar(callback);
};

const motoServicoAtualizar = (key: string, moto: Moto, callback: MotoSalvarCallback): void => {
  if (motoSchema && motoSchema.validate) {
    motoSchema.validate(moto)
      .then(() => motoFetcherAtualizar(key, moto, callback))
      .catch((errors: any) => callback(false, errors.message || String(errors)));
  } else {
    motoFetcherAtualizar(key, moto, callback);
  }
};

const motoServicoDeletar = (key: string, callback: (sucesso: boolean, mensagem: string) => void): void => {
  motoFetcherDeletar(key, callback);
};

export { motoServicoSalvar, motoServicoListar, motoServicoAtualizar, motoServicoDeletar };
