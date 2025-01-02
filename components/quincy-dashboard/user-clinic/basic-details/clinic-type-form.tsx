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
import { NestedSelect } from '@/components/ui/nest-input';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UPDATE_UNSUCCESSFUL } from '@/consts/erroring.const';
import {
  FormFieldsTrans,
  stringLengthValidation,
  ValidationsTrans,
} from '@/lib/validations';
import en from '@/messages/en.json';
import { ClinicType } from '@/types/enums';
import { EnumsTrans, ErrorsTrans } from '@/types/translations';
import { createClient } from '@/utils/supabase/client';

type ClinicTypeDetails = {
  clinic_type_id: string;
};

type Props = ComponentProps<'div'> & {
  clinic_type_id: ClinicType;
  user_id: string;
};

const useValidationSchema = (
  t: ValidationsTrans,
  tFields: FormFieldsTrans,
): ZodType<ClinicTypeDetails> => {
  return z.object({
    clinic_type_id: stringLengthValidation(tFields('clinic_type_id'), t),
  });
};

export function ClinicTypeForm({ clinic_type_id, user_id, ...props }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastClinicType, setLastClinicType] = useState(clinic_type_id);

  const tZod: ValidationsTrans = useTranslations('Auth.validations.zod');
  const tFields: FormFieldsTrans = useTranslations('Forms.fields');
  const tErrors: ErrorsTrans = useTranslations('Errors');

  const tClinicTypeEnumTrans: EnumsTrans<'clinic_types'> =
    useTranslations('Enums.clinic_types');

  const supabase = createClient();
  const formSchema = useValidationSchema(tZod, tFields);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinic_type_id: lastClinicType,
    },
    mode: 'onChange',
  });

  const handleChange = async (clinic_type_id: ClinicType) => {
    if (clinic_type_id != lastClinicType) {
      // remove errors
      form.clearErrors('clinic_type_id');
      form.setValue('clinic_type_id', clinic_type_id);

      setIsUpdating(true);
      const { error } = await supabase
        .from('user_base_details')
        .update({ clinic_type_id })
        .eq('id', user_id);

      if (error) {
        // revert failed action
        form.setValue('clinic_type_id', lastClinicType);
        // show error
        form.setError('clinic_type_id', {
          message: tErrors(UPDATE_UNSUCCESSFUL),
        });
      } else {
        setLastClinicType(clinic_type_id);
      }
      setIsUpdating(false);
    }
  };
  const all_clinic_types = Object.keys(en.Enums.clinic_types) as ClinicType[];
  return (
    <FormProvider {...form}>
      <form className={props.className}>
        <FormField
          control={form.control}
          name="clinic_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tFields(field.name)}</FormLabel>
              <NestedSelect
                onValueChange={handleChange}
                defaultValue={field.value}
                {...field}
              >
                <FormControl>
                  <SelectTrigger disabled={isUpdating}>
                    <SelectValue
                      placeholder={tFields(`${field.name}_placeholder`)}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {all_clinic_types.map(clinic_type_id => (
                    <SelectItem key={clinic_type_id} value={clinic_type_id}>
                      {tClinicTypeEnumTrans(clinic_type_id)}
                    </SelectItem>
                  ))}
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
