import * as yup from 'yup';
import { object, string } from 'yup';
import i18n from '../i18n';


// Schema para cadastro (senha obrigatória)
const cadastroSchema: yup.ObjectSchema<any, any> = object({
  nome: string().required(i18n.t('validation.nameRequired')),
  email: string().email(i18n.t('validation.emailInvalid')).required(i18n.t('validation.emailRequired')),
  senha: string()
    .min(8, i18n.t('validation.passwordMin'))
    .max(15, i18n.t('validation.passwordMax'))
    .required(i18n.t('validation.passwordRequired')),
});

// Schema para atualização (senha opcional)
const atualizarSchema: yup.ObjectSchema<any, any> = object({
  nome: string().required(i18n.t('validation.nameRequired')),
  email: string().email(i18n.t('validation.emailInvalid')).required(i18n.t('validation.emailRequired')),
  senha: string().min(8, i18n.t('validation.passwordMin')).max(15, i18n.t('validation.passwordMax')).notRequired(),
});


type ListaCadastro = yup.InferType<typeof cadastroSchema>;
type AtualizarCadastro = yup.InferType<typeof atualizarSchema>;


export { ListaCadastro, AtualizarCadastro, cadastroSchema, atualizarSchema };
