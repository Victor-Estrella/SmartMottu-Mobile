import axios from 'axios';
import { ListaLogin } from '../model/Login';

const apiLocal = axios.create({
    baseURL: "http://192.168.0.24:8080",
});

export async function loginUsuario(login: ListaLogin) {
    const resp = await apiLocal.post('/usuarios/login', login);
    return resp.data;
}
