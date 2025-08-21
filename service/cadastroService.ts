import { ListaCadastro, cadastroSchema } from "../model/Cadastro";
import { cadastroFetcherSalvar, SalvarCallback } from "../fetcher/cadastroFetcher";

const cadastroServicoSalvar = (cadastro: ListaCadastro, callback: SalvarCallback): void => {
  if (cadastroSchema && cadastroSchema.validate) {
    cadastroSchema.validate(cadastro)
      .then(() => cadastroFetcherSalvar(cadastro, callback))
      .catch((errors: any) => callback(false, errors.message || String(errors)));
  } else {
    cadastroFetcherSalvar(cadastro, callback);
  }
};

export { cadastroServicoSalvar };
