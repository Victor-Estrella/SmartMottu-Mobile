import { Moto, motoSchema } from "../model/Moto";
import { criarMoto, listarMotos, atualizarMoto, deletarMoto } from "../fetcher/motoFetcher";

export async function motoServicoSalvar(moto: Moto) {
  if (motoSchema && motoSchema.validate) {
    await motoSchema.validate(moto);
  }
  return await criarMoto(moto);
}

export async function motoServicoListar() {
  return await listarMotos();
}

export async function motoServicoAtualizar(idMoto: string, moto: Moto) {
  if (motoSchema && motoSchema.validate) {
    await motoSchema.validate(moto);
  }
  return await atualizarMoto(Number(idMoto), moto);
}

export async function motoServicoDeletar(idMoto: string) {
  return await deletarMoto(Number(idMoto));
}
