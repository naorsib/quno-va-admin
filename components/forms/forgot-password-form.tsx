'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';

import { forgotPasswordAction } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NestedInput } from '@/components/ui/nest-input';
import { FormButtonsTrans } from '@/lib/utils';
import {
  emailValidation,
  formFieldsTrans,
  ValidationsTrans,
} from '@/lib/validations';

export interface ForgotPasswordFormData {
  email: string;
}
const useValidationSchema = (
  t: ValidationsTrans,
  tFields: formFieldsTrans,
): ZodType<ForgotPasswordFormData> => {
  return z.object({
    email: emailValidation(tFields('email'), t),
  });
};

type Props = ComponentProps<'div'>;

export function ForgotPasswordForm({ ...props }: Props) {
  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: formFieldsTrans = useTranslations('Forms.fields');
  const tb: FormButtonsTrans<'forgotPassword'> = useTranslations(
    'Forms.buttons.forgotPassword',
  );

  const formSchema = useValidationSchema(tZod, tFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
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
          <SubmitButton
            pendingText={tb('load')}
            additions="main"
            disabled={!form.formState.isValid}
            className="bg-card-button text-white"
            formAction={forgotPasswordAction}
          >
            {tb('text')}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
