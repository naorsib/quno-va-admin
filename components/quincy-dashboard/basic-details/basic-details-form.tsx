'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ComponentProps, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { ZodType } from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NestedInput } from '@/components/ui/nest-input';
import {
  FormFieldsTrans,
  stringLengthValidation,
  ValidationsTrans,
} from '@/lib/validations';
import { ErrorsTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/client';

export type UserClinicBase = {
  clinic_name: string;
  address?: string;
};

type Props = ComponentProps<'div'> & {
  clinic_base: UserClinicBase;
  userId: string;
};

const useValidationSchema = (
  t: ValidationsTrans,
  tFields: FormFieldsTrans,
): ZodType<UserClinicBase> => {
  return z.object({
    clinic_name: stringLengthValidation(tFields('clinic_name'), t),
    address: stringLengthValidation(tFields('address'), t),
  });
};

export function BasicDetailsForm({ clinic_base, userId, ...props }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [clinicBase, setClinicBase] = useState(clinic_base);

  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: FormFieldsTrans = useTranslations('Forms.fields');
  const tErrors: ErrorsTrans = useTranslations('Errors');

  const supabase = createClient();
  const formSchema = useValidationSchema(tZod, tFields);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinic_name: clinicBase.clinic_name,
      address: clinicBase.address || '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    debugger;
    form.clearErrors();
    const clinic_name = values.clinic_name;
    const address = values.address;
    let updateObject: Partial<UserClinicBase> = {};
    let updatedField: keyof UserClinicBase | undefined;
    if (clinicBase.address !== address) {
      updateObject.address = address;
      updatedField = 'address';
    }
    if (clinicBase.clinic_name !== clinic_name) {
      updateObject.clinic_name = clinic_name;
      updatedField = 'clinic_name';
    }
    if (updatedField) {
      setIsUpdating(true);
      const { error } = await supabase
        .from('user_basic_details')
        .update(updateObject)
        .eq('id', userId);

      if (error) {
        // revert failed action
        form.setValue(updatedField, clinicBase[updatedField]);
        // set errors
        form.setError(updatedField, {
          message: tErrors('update_unsuccessful'),
        });
      } else {
        setClinicBase(Object.assign(clinicBase, updateObject));
      }
      setIsUpdating(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onBlur={form.handleSubmit(onSubmit)} className={props.className}>
        <FormField
          control={form.control}
          name="clinic_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tFields(field.name)}</FormLabel>
              <FormControl>
                <NestedInput disabled={isUpdating} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tFields(field.name)}</FormLabel>
              <FormControl>
                <NestedInput disabled={isUpdating} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
}
