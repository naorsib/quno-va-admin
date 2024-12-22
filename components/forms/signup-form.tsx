'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';

import { signUpAction } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputWithPrefix, NestedInput } from '@/components/ui/nest-input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  emailValidation,
  FormFieldsTrans,
  phoneValidation,
  stringLengthValidation,
  ValidationsTrans,
} from '@/lib/validations';
import { FormButtonsTrans } from '@/types/translations';

export interface SignupFormData {
  country_code: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password: string;
}
const useValidationSchema = (
  t: ValidationsTrans,
  tFields: FormFieldsTrans,
): ZodType<SignupFormData> => {
  return z.object({
    country_code: z.string(),
    first_name: stringLengthValidation(tFields('first_name'), t),
    last_name: stringLengthValidation(tFields('last_name'), t),
    phone: phoneValidation(tFields('phone'), t),
    email: emailValidation(tFields('email'), t),
    password: stringLengthValidation(tFields('password'), t, 6, 20),
  });
};

type Props = ComponentProps<'div'>;

export function SignUpForm({ ...props }: Props) {
  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: FormFieldsTrans = useTranslations('Forms.fields');
  const tb: FormButtonsTrans<'signup'> = useTranslations(
    'Forms.buttons.signup',
  );
  const formSchema = useValidationSchema(tZod, tFields);
  const country_code = '49';
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country_code,
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <form className={props.className}>
        <FormField
          control={form.control}
          name="country_code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <NestedInput type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tFields(field.name)}</FormLabel>
                  <FormControl>
                    <NestedInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tFields(field.name)}</FormLabel>
                  <FormControl>
                    <NestedInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields(field.name)}</FormLabel>
                <FormControl>
                  <NestedInput type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields(field.name)}</FormLabel>
                <FormControl>
                  <InputWithPrefix
                    country_code={country_code}
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields(field.name)}</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            pendingText={tb('load')}
            additions="main"
            disabled={!form.formState.isValid}
            className="bg-card-button text-white"
            formAction={signUpAction}
          >
            {tb('text')}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
