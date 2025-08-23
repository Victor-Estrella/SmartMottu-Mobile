import { ListaCadastro, cadastroSchema } from "../model/Cadastro";
import { criarUsuario } from "../fetcher/cadastroFetcher";

export async function cadastroServicoSalvar(cadastro: ListaCadastro) {
  if (cadastroSchema && cadastroSchema.validate) {
    await cadastroSchema.validate(cadastro);
  }
  return await criarUsuario(cadastro);
}
