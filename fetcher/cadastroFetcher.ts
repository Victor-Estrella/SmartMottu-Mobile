import axios from 'axios';
import { ListaCadastro, ListaLogin } from "../model/Cadastro";

const apiLocal = axios.create({
  baseURL: "http://192.168.0.24:8080",
});


// Cria um novo usuário tipado
export async function criarUsuario(data: ListaCadastro) {
  const resp = await apiLocal.post('/usuarios', data);
  return resp.data;
}

// Realiza login
export async function loginUsuario(login: ListaLogin) {
  const resp = await apiLocal.post('/usuarios/login', login);
  return resp.data;
}

// Retorna todos os usuários
export async function listarUsuarios() {
  const resp = await apiLocal.get('/usuarios');
  return resp.data;
}

// Retorna um usuário específico
export async function buscarUsuario(idUsuario: number) {
  const resp = await apiLocal.get(`/usuarios/${idUsuario}`);
  return resp.data;
}

// Atualiza um usuário específico
export async function atualizarUsuario(idUsuario: number, data: ListaCadastro) {
  const resp = await apiLocal.put(`/usuarios/${idUsuario}`, data);
  return resp.data;
}

// Deleta um usuário específico
export async function deletarUsuario(idUsuario: number) {
  const resp = await apiLocal.delete(`/usuarios/${idUsuario}`);
  return resp.status === 200;
}


