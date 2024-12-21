import { ComponentProps } from 'react';
import { FormProvider } from 'react-hook-form';

import { SignupFormData } from './signup-form';
import { UserSignupDetails } from './verify-otp-form';

/** EXPERIMENTAL - CURRENTLY NOT IN USE */
type Props = ComponentProps<
  typeof FormProvider<UserSignupDetails | SignupFormData>
> & {
  submit: (event?: React.BaseSyntheticEvent) => Promise<void>;
};

export function AuthFormWrapper({ submit, ...props }: Props) {
  return (
    <FormProvider {...props}>
      <form onSubmit={submit} className="grid gap-8">
        {props.children}
      </form>
    </FormProvider>
  );
}
