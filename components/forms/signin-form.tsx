'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';

import { signInAction } from '@/app/actions';
import { StaticRouteLink } from '@/components/static-route-link';
import { SubmitButton } from '@/components/submit-button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NestedInput } from '@/components/ui/nest-input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  emailValidation,
  FormFieldsTrans,
  stringLengthValidation,
  ValidationsTrans,
} from '@/lib/validations';
import { FormButtonsTrans } from '@/types/translations';

export interface SignupFormData {
  email: string;
  password: string;
}
const useValidationSchema = (
  t: ValidationsTrans,
  tFields: FormFieldsTrans,
): ZodType<SignupFormData> => {
  return z.object({
    email: emailValidation(tFields('email'), t),
    password: stringLengthValidation(tFields('password'), t, 6, 20),
  });
};

type Props = ComponentProps<'div'>;

export function SignInForm({ ...props }: Props) {
  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: FormFieldsTrans = useTranslations('Forms.fields');

  const tb: FormButtonsTrans<'signin'> = useTranslations(
    'Forms.buttons.signin',
  );
  const formSchema = useValidationSchema(tZod, tFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <form className={props.className}>
        <div className="grid gap-6">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tFields(field.name)}</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
                <StaticRouteLink
                  className="text-xs text-foreground underline hover:text-secondary"
                  routeTo="forgotPassword"
                >
                  {tb('forgotPasswordLinkText')}
                </StaticRouteLink>
              </FormItem>
            )}
          />
          <SubmitButton
            pendingText={tb('load')}
            additions="main"
            disabled={!form.formState.isValid}
            className="bg-card-button text-white"
            formAction={signInAction}
          >
            {tb('text')}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
