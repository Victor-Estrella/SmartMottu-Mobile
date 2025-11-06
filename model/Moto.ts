import * as yup from 'yup';
import { object, string } from 'yup';
import i18n from '../i18n';

const motoSchema: yup.ObjectSchema<any, any> = object({
  modelo: string().required(i18n.t('moto.validation.modelRequired')),
  unidade: string().required(i18n.t('moto.validation.unitRequired')),
  status: string().required(i18n.t('moto.validation.statusRequired')),
  setor: string().required(i18n.t('moto.validation.sectorRequired')),
  placa: string()
    .required(i18n.t('moto.validation.plateRequired'))
    .min(7, i18n.t('moto.validation.plateLength'))
    .max(7, i18n.t('moto.validation.plateLength')),
  nmChassi: string()
    .required(i18n.t('moto.validation.chassiRequired'))
    .min(17, i18n.t('moto.validation.chassiLength'))
    .max(17, i18n.t('moto.validation.chassiLength')),
});

type Moto = yup.InferType<typeof motoSchema> & { idMoto?: number, qrcode?: string };

export { Moto, motoSchema };
