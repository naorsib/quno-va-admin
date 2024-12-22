'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z, ZodType } from 'zod'; // Add new import

import { sendPhoneOtp } from '@/app/actions';
import { SubmitButton } from '@/components/submit-button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputWithPrefix, NestedInput } from '@/components/ui/nest-input';
import {
  phoneValidation,
  stringLengthValidation,
  ValidationsTrans,
} from '@/lib/validations';
import { FormButtonsTrans } from '@/types/translations';

export type UserSignupDetails = {
  country_code: string;
  first_name: string;
  last_name: string;
  phone: string;
};

type Props = ComponentProps<'div'> & {
  signupDetails: UserSignupDetails;
};

const useValidationSchema = (
  t: ValidationsTrans,
): ZodType<UserSignupDetails> => {
  return z.object({
    country_code: z.string(),
    first_name: stringLengthValidation('First Name', t),
    last_name: stringLengthValidation('Last Name', t),
    phone: phoneValidation('Phone', t),
  });
};

export function VerifyOtpForm({ signupDetails, ...props }: Props) {
  const tZod = useTranslations('Auth.validations.zod');
  const t = useTranslations('Forms.fields');
  const tb: FormButtonsTrans<'verifyOtp'> = useTranslations(
    'Forms.buttons.verifyOtp',
  );
  const formSchema = useValidationSchema(tZod);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country_code: signupDetails.country_code,
      first_name: signupDetails.first_name || '',
      last_name: signupDetails.last_name || '',
      phone: signupDetails.phone || '',
    },
    mode: 'onBlur',
  });

  return (
    <FormProvider {...form}>
      <form className="grid gap-6">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(field.name)}</FormLabel>
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
                <FormLabel>{t(field.name)}</FormLabel>
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(field.name)}</FormLabel>
              <FormControl>
                <InputWithPrefix
                  type="number"
                  country_code={signupDetails.country_code}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          additions="main"
          disabled={!form.formState.isValid}
          className="bg-card-button font-normal text-white"
          pendingText={tb('load')}
          formAction={sendPhoneOtp}
        >
          {tb('text')}
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
