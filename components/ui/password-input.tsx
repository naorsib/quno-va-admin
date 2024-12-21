import { Eye } from 'lucide-react';
import { ComponentProps, useState } from 'react';

import { NestedInput } from './nest-input';

export function PasswordInput(props: ComponentProps<typeof NestedInput>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Eye
        onClick={() => setShowPassword(!showPassword)}
        data-visible={showPassword}
        className="absolute right-0 top-0 m-2 cursor-pointer data-[visible=true]:text-secondary"
      />
      <NestedInput
        className={showPassword ? '' : 'text-4xl tracking-password'}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
    </div>
  );
}
