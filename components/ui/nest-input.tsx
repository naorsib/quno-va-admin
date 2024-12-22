'use client';

import { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from './input';
import { Select } from './select';

export function NestedInput(props: ComponentProps<typeof Input>) {
  const { register } = useFormContext(); // retrieve all hook methods

  return <Input {...register(props.name as string)} {...props} />;
}

export function NestedSelect(props: ComponentProps<typeof Select>) {
  const { register } = useFormContext(); // retrieve all hook methods

  return <Select {...register(props.name as string)} {...props} />;
}

type InputWithPrefixProps = ComponentProps<typeof Input> & {
  country_code: string;
};
export function InputWithPrefix({
  country_code,
  ...props
}: InputWithPrefixProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute mt-px p-2">
        +{country_code}
      </div>
      <NestedInput className="indent-8" {...props} />
    </div>
  );
}
