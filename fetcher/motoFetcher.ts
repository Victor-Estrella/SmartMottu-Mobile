import { Moto } from "../model/Moto";
import axios from 'axios';

const apiLocal = axios.create({
  baseURL: "http://localhost:8080",
});

// Cria uma nova moto
export async function criarMoto(data: Moto) {
  const resp = await apiLocal.post('/motos', data);
  return resp.data;
}

// Retorna todas as motos
export async function listarMotos() {
  const resp = await apiLocal.get('/motos');
  return resp.data;
}

// Retorna uma moto específica
export async function buscarMoto(idMoto: number) {
  const resp = await apiLocal.get(`/motos/${idMoto}`);
  return resp.data;
}

// Atualiza uma moto específica
export async function atualizarMoto(idMoto: number, data: Moto) {
  const resp = await apiLocal.put(`/motos/${idMoto}`, data);
  return resp.data;
}

// Deleta uma moto específica
export async function deletarMoto(idMoto: number) {
  const resp = await apiLocal.delete(`/motos/${idMoto}`);
  return resp.status === 200;
}
