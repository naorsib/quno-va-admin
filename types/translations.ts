import { TranslationValues } from 'next-intl';

import en from '@/messages/en.json';

export type GenericTrans<T> = (
  key: T,
  value?: TranslationValues | undefined,
) => string;

// const buttons = en.Forms.buttons;
// type ButtonType<B extends ButtonsNames> = typeof buttons[B]
// type SignInButton = ButtonType<'signin'>

// function getFormButtonsTrans(buttonName: ButtonsNames) {
//   const type =  en.Forms.buttons;
//   const button = type[buttonName]

// }

const buttons = en.Forms.buttons;
type ButtonsNames = keyof typeof buttons;

export type FormButtonsTrans<B extends ButtonsNames> = GenericTrans<
  keyof (typeof buttons)[B]
>;

const authPages = en.Auth.pages;
type PagesNames = keyof typeof authPages;

export type AuthPagesTrans<P extends PagesNames> = GenericTrans<
  keyof (typeof authPages)[P]
>;

const enums = en.Enums;
type EnumsNames = keyof typeof enums;

export type EnumsTrans<E extends EnumsNames> = GenericTrans<
  keyof (typeof enums)[E]
>;
type errorsKeys = keyof typeof en.Errors;
export type ErrorsTrans = GenericTrans<errorsKeys>;
