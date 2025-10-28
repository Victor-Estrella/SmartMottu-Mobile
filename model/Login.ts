import * as yup from 'yup';
import { object, string } from 'yup';

const loginSchema: yup.ObjectSchema<any, any> = object({
    email: string().email("Informe um email válido").required("Por favor preencha o email"),
    senha: string().required("Por favor preencha a senha"),
});

type ListaLogin = yup.InferType<typeof loginSchema>;

export { ListaLogin, loginSchema };