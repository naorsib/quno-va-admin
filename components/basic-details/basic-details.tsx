import React, { ComponentProps } from 'react';

import { createClient } from '@/utils/supabase/server';

import { BasicDetailsForm, UserBasicDetails } from './basic-details-form';

type Props = ComponentProps<'div'> & {
  basicDetails: UserBasicDetails;
  userId: string;
};

export async function BasicDetails({ basicDetails, userId, ...props }: Props) {
  const supabase = await createClient();

  console.log(userId);
  return (
    <div
      className={`flex w-full flex-col items-start gap-2 text-sm ${props.className}`}
    >
      <BasicDetailsForm
        userId={userId}
        basicDetails={basicDetails}
        className="grid w-full max-w-xs grid-cols-1 gap-4 sm:max-w-lg sm:grid-cols-2"
      >
        {/* <FormField
          control={form.control}
          name="clinic_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* <div className="w-full">
          <Label htmlFor="clinic_name">Clinic Name</Label>
          <InteractiveInput
            name="clinic_name"
            autoComplete="off"
            inputValue={details.clinic_name}
          />
        </div>
        <div className="w-full">
          <Label htmlFor="address">Address</Label>
          <Input name="address" autoComplete="off" required />
        </div> */}
      </BasicDetailsForm>
    </div>
    // <div className="grid grid-cols-1 grid gap-4 max-w-xs md:grid-cols-2 md:max-w-full w-fit ">
    //   <Input
    //     className="relative w-full p-4 w-80"
    //     name="email"
    //     placeholder="you@example.com"
    //     required
    //   />
    //   <Input
    //     className="relative w-full p-4 w-80"
    //     name="email"
    //     placeholder="you@example.com"
    //     required
    //   />
    // </div>
  );
}
