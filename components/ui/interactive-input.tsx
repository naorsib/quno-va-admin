'use client';

import * as React from 'react';

import { Input } from '@/components/ui/input';

type Props = React.ComponentProps<typeof Input> & {
  inputValue: string;
};
const InteractiveInput = React.forwardRef<
  HTMLInputElement,
  typeof Input & Props
>(({ inputValue, ...props }, ref) => {
  const [lastValidValue, setLastValidValue] = React.useState(inputValue || '');
  const [value, setValue] = React.useState(inputValue || '');

  const handleOnChange = ({ target }: { target: HTMLInputElement }) => {
    setValue(target.value);
  };
  const handleInputBlurred = async ({
    target,
  }: {
    target: HTMLInputElement;
  }) => {
    const lastWorkingValue = value;
    const newValue = target.value;
    if (newValue) {
      setValue(newValue);
    } else {
      setValue(lastWorkingValue);
    }
  };

  return (
    <Input
      onBlur={handleInputBlurred}
      onChange={handleOnChange}
      {...props}
      value={value || ''}
      ref={ref}
    />
  );
});
InteractiveInput.displayName = 'InteractiveInput';

export { InteractiveInput };
