import * as yup from 'yup';
import { object, string } from 'yup';

const motoSchema: yup.ObjectSchema<any, any> = object({
  setor: string().required("Por favor preencha o setor"),
  id: string().required("Por favor preencha o id"),
  modelo: string().required("Por favor preencha o modelo"),
  unidade: string(),
  status: string(),
  placa: string(),
  chassi: string(),
});

type Moto = yup.InferType<typeof motoSchema>;

export { Moto, motoSchema };
