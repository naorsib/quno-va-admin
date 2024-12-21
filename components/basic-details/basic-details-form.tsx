'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { ComponentProps, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { NestedInput } from '@/components/ui/nest-input';

export type UserBasicDetails = {
  id: number;
  clinic_name: string;
  address: string;
};

type Props = ComponentProps<'div'> & {
  basicDetails: UserBasicDetails;
  userId: string;
};
const formSchema = z.object({
  clinic_name: z.string(),
  address: z.string(),
});

export function BasicDetailsForm({ basicDetails, userId, ...props }: Props) {
  const [basicUserDetails, setBasicUserDetails] = useState(basicDetails);

  const onSubmit = (values: z.infer<typeof formSchema>) => {};

  // TODO - add validations
  const methods = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clinic_name: basicDetails.clinic_name,
      address: basicDetails.address,
    },
    mode: 'onBlur',
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        onBlur={methods.handleSubmit(onSubmit)}
        className={props.className}
      >
        <FormField
          control={methods.control}
          name="clinic_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <NestedInput type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <NestedInput type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </FormProvider>
  );
}
