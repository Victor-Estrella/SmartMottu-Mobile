import * as yup from 'yup';
import { object, string } from 'yup';
import i18n from '../i18n';

const loginSchema: yup.ObjectSchema<any, any> = object({
    email: string().email(i18n.t('validation.emailInvalid')).required(i18n.t('validation.emailRequired')),
    senha: string().required(i18n.t('validation.passwordRequired')),
});

type ListaLogin = yup.InferType<typeof loginSchema>;

export { ListaLogin, loginSchema };