import * as yup from 'yup';
import { object, string } from 'yup';

const cadastroSchema: yup.ObjectSchema<any, any> = object({
  nome: string().required("Por favor preencha o nome"),
  email: string().email("Informe um email válido").required("Por favor preencha o email"),
  senha: string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Por favor preencha a senha"),
});

type ListaCadastro = yup.InferType<typeof cadastroSchema>;


export { ListaCadastro, cadastroSchema };
