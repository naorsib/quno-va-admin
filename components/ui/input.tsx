import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        autoComplete={props.autoComplete}
        type={type}
        className={cn(
          'ring-offset-bg flex h-10 w-full rounded-md border border-border-input bg-white px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        id={props.name}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
