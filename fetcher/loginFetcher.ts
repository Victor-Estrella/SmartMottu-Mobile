import axios from 'axios';
import { ListaLogin } from '../model/Login';

const apiLocal = axios.create({
    baseURL: process.env.API_URL || "https://smartmottu-api.onrender.com",
});

export async function loginUsuario(login: ListaLogin) {
    const resp = await apiLocal.post('/usuarios/login', login);
    return resp.data;
}
