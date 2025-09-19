import { ListaCadastro, AtualizarCadastro, cadastroSchema, atualizarSchema } from "../model/Cadastro";
import { atualizarUsuario, criarUsuario, deletarUsuario } from "../fetcher/cadastroFetcher";

export async function cadastroServicoSalvar(cadastro: ListaCadastro) {
  if (cadastroSchema && cadastroSchema.validate) {
    await cadastroSchema.validate(cadastro);
  }
  return await criarUsuario(cadastro);
}

export async function cadastroServicoAtualizar(idCadastro: string, cadastro: AtualizarCadastro) {
  if (atualizarSchema && atualizarSchema.validate) {
    await atualizarSchema.validate(cadastro);
  }
  return await atualizarUsuario(Number(idCadastro), cadastro);
}



export async function usuarioServicoDeletar(idCadastro: string) {
  return await deletarUsuario(Number(idCadastro));
}
