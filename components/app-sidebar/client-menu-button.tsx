'use client';

import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

import { SidebarMenuButton } from '@/components/ui/sidebar';

export type MenuItemData = {
  url?: string;
};
type Props = ComponentProps<'div'> & MenuItemData;

export function ClientMenuButton({ url, ...props }: Props) {
  const pathname = usePathname();
  const isActive = pathname == url;
  const isDisabled = !url;

  return (
    <SidebarMenuButton aria-disabled={isDisabled} isActive={isActive} asChild>
      {props.children}
    </SidebarMenuButton>
  );
}
