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
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormFieldsTrans,
  stringLengthValidation,
  ValidationsTrans,
} from '@/lib/validations';
import { EnumsTrans, ErrorsTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/client';

import { NestedSelect } from '../ui/nest-input';

type ClinicTypeDetails = {
  clinic_type: string;
};

type Props = ComponentProps<'div'> & {
  clinic_type?: string;
  userId: string;
};

const useValidationSchema = (
  t: ValidationsTrans,
  tFields: FormFieldsTrans,
): ZodType<ClinicTypeDetails> => {
  return z.object({
    clinic_type: stringLengthValidation(tFields('clinic_type'), t),
  });
};

export function ClinicTypeForm({ clinic_type, userId, ...props }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastClinicType, setLastClinicType] = useState(clinic_type || '');

  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: FormFieldsTrans = useTranslations('Forms.fields');
  const tErrors: ErrorsTrans = useTranslations('Errors');

  const tClinicTypeEnumTrans: EnumsTrans<'clinic_type'> =
    useTranslations('Enums.clinic_type');

  const supabase = createClient();
  const formSchema = useValidationSchema(tZod, tFields);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinic_type: lastClinicType,
    },
    mode: 'onChange',
  });

  const handleChange = async (clinic_type: string) => {
    if (clinic_type != lastClinicType) {
      // remove errors
      form.clearErrors('clinic_type');
      form.setValue('clinic_type', clinic_type);

      setIsUpdating(true);
      const { error } = await supabase
        .from('user_basic_details')
        .update({ clinic_type })
        .eq('id', userId);

      if (error) {
        // revert failed action
        form.setValue('clinic_type', lastClinicType);
        // show error
        form.setError('clinic_type', {
          message: tErrors('update_unsuccessful'),
        });
      } else {
        setLastClinicType(clinic_type);
      }
      setIsUpdating(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form className={props.className}>
        <FormField
          control={form.control}
          name="clinic_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tFields(field.name)}</FormLabel>
              <NestedSelect
                onValueChange={handleChange}
                defaultValue={field.value}
                {...field}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="clinictype1">
                    {tClinicTypeEnumTrans('clinictype1')}
                  </SelectItem>
                  <SelectItem value="clinictype2">
                    {tClinicTypeEnumTrans('clinictype2')}
                  </SelectItem>
                  <SelectItem value="clinictype3">
                    {tClinicTypeEnumTrans('clinictype3')}
                  </SelectItem>
                </SelectContent>
              </NestedSelect>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
}
