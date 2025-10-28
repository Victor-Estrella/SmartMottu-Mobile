import { ListaLogin, loginSchema } from "../model/Login";
import { loginUsuario } from "../fetcher/loginFetcher";

export async function loginServico(login: ListaLogin) {
    if (loginSchema && loginSchema.validate) {
        await loginSchema.validate(login);
    }
    return await loginUsuario(login);
}
