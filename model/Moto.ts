import * as yup from 'yup';
import { object, string } from 'yup';

const motoSchema: yup.ObjectSchema<any, any> = object({
  modelo: string().required("Por favor preencha o modelo"),
  unidade: string().required("Por favor preencha a unidade"),
  status: string().required("Por favor preencha o status"),
  setor: string().required("Por favor preencha o setor"),
  placa: string().required("Por favor preencha a placa").min(7, "A placa deve ter 7 caracteres").max(7, "A placa deve ter 7 caracteres"),
  nmChassi: string().required("Por favor preencha o chassi").min(17, "O chassi deve ter 17 caracteres").max(17, "O chassi deve ter 17 caracteres"),
});

type Moto = yup.InferType<typeof motoSchema> & { idMoto?: number };

export { Moto, motoSchema };
