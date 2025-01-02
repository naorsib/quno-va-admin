import en from '@/messages/en.json';
import { TranslationValues } from 'next-intl';

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

const authPages = en.Auth.pages;
type AuthPagesNames = keyof typeof authPages;

export type AuthPagesTrans<P extends AuthPagesNames> = GenericTrans<
  keyof (typeof authPages)[P]
>;

const innerPages = en.InnerPages;
type InnerPagesNames = keyof typeof innerPages;

export type InnerPagesTrans<P extends InnerPagesNames> = GenericTrans<
  keyof (typeof innerPages)[P]
>;

const dialogs = en.Dialogs;
type DialogsNames = keyof typeof dialogs;

export type DialogsTrans<P extends DialogsNames> = GenericTrans<
  keyof (typeof dialogs)[P]
>;

const buttons = en.Forms.buttons;
type ButtonsNames = keyof typeof buttons;

export type FormButtonsTrans<B extends ButtonsNames> = GenericTrans<
  keyof (typeof buttons)[B]
>;

const enums = en.Enums;
type EnumsNames = keyof typeof enums;

export type EnumsTrans<E extends EnumsNames> = GenericTrans<
  keyof (typeof enums)[E]
>;
type errorsKeys = keyof typeof en.Errors;
export type ErrorsTrans = GenericTrans<errorsKeys>;

const call_events = en.CallEvents;
type CallEventNames = keyof typeof call_events;

export type CallEvenTrans<E extends CallEventNames> = GenericTrans<
  keyof (typeof call_events)[E]
>;
