import * as yup from 'yup';
import { object, string } from 'yup';


// Schema para cadastro (senha obrigatória)
const cadastroSchema: yup.ObjectSchema<any, any> = object({
  nome: string().required("Por favor preencha o nome"),
  email: string().email("Informe um email válido").required("Por favor preencha o email"),
  senha: string().min(6, "A senha deve ter pelo menos 6 caracteres").required("Por favor preencha a senha"),
});

// Schema para atualização (senha opcional)
const atualizarSchema: yup.ObjectSchema<any, any> = object({
  nome: string().required("Por favor preencha o nome"),
  email: string().email("Informe um email válido").required("Por favor preencha o email"),
  senha: string().min(6, "A senha deve ter pelo menos 6 caracteres").notRequired(),
});


type ListaCadastro = yup.InferType<typeof cadastroSchema>;
type AtualizarCadastro = yup.InferType<typeof atualizarSchema>;


export { ListaCadastro, AtualizarCadastro, cadastroSchema, atualizarSchema };
