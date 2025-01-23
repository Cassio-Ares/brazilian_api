import { z } from 'zod';

export const collaboratorValidationSchema = z.object({
  name: z.string().trim().min(1, 'Name is essential for registration'),
  email: z
    .string()
    .trim()
    .min(1, 'E-mail é essential for registration')
    .email(),
  phone: z.string().trim().min(1, 'Whats é essential for registration'),
  eircode: z
    .string()
    .trim()
    .min(7, 'Address is essential for registration')
    .max(8),
  work: z.enum([
    'serviço de limpeza',
    'paisagismo e jardinagem',
    'pintura',
    'reformas',
    'manicure e pedicure',
    'costura',
  ]),
  equipment: z.boolean(),
  whatEquipment: z.string().trim().optional(),
  shapeOfDisplacement: z.enum([
    'carro',
    'moto',
    'transporte publico',
    'caminhando',
    'carro de aplicativo',
  ]),
  dataProtection: z.boolean(),
  captchaToken: z.string().min(1, 'Captcha verification is required'),
});
