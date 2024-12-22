'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod';

import { resetPasswordAction } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { FormButtonsTrans } from '@/lib/utils';
import {
  FormFieldsTrans,
  passwordValidation,
  ValidationsTrans,
} from '@/lib/validations';

export interface ResetPasswordFormData {
  confirmPassword: string;
  newPassword: string;
}
const useValidationSchema = (
  t: ValidationsTrans,
  tFields: FormFieldsTrans,
): ZodType<ResetPasswordFormData> => {
  return z.object({
    confirmPassword: passwordValidation(tFields('confirmPassword'), t),
    newPassword: passwordValidation(tFields('newPassword'), t),
  });
};

type Props = ComponentProps<'div'>;

export function ResetPasswordForm({ ...props }: Props) {
  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: FormFieldsTrans = useTranslations('Forms.fields');
  const tb: FormButtonsTrans<'resetPassword'> = useTranslations(
    'Forms.buttons.resetPassword',
  );

  const formSchema = useValidationSchema(tZod, tFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmPassword: '',
      newPassword: '',
    },
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <form className={props.className}>
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="newPassword"
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
          <FormField
            control={form.control}
            name="confirmPassword"
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
            formAction={resetPasswordAction}
          >
            {tb('text')}
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
