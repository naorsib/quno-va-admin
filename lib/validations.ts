import * as z from 'zod';

import en from '@/messages/en.json';

import { GenericTrans } from '../types/translations';

type formFieldsKeys = keyof typeof en.Forms.fields;

export type FormFieldsTrans = GenericTrans<formFieldsKeys>;

type firstZodKey = keyof typeof en.Auth.validations.zod;

export type ValidationsTrans = GenericTrans<firstZodKey>;

// Future option, if needed
// export type ValidationsTrans = (
//   key: firstZodKey | `${firstZodKey}.custom`,
//   val?: TranslationValues | undefined
// ) => string;

export const stringLengthValidation = (
  fieldName: string,
  t: ValidationsTrans,
  min: number = 2,
  max: number = 50,
) => {
  return z
    .string()
    .min(min, {
      message: t('minLengthMessage', { fieldName, min }),
    })
    .max(max, {
      message: t('maxLengthMessage', { fieldName, max }),
    });
};

export const phoneValidation = (fieldName: string, t: ValidationsTrans) => {
  return z
    .string()
    .transform(value => value.replaceAll(/^0{1}/g, ''))
    .refine(value => value.length == 11, {
      message: t('phoneLengthMessage', { fieldName }),
    });
};

export const emailValidation = (fieldName: string, t: ValidationsTrans) => {
  return z.string().email({ message: t('invalidMessage', { fieldName }) });
};

export const passwordValidation = (fieldName: string, t: ValidationsTrans) =>
  stringLengthValidation(fieldName, t, 6, 20);
