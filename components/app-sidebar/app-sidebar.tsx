import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import getConfig from 'next/config';

import { signOutAction } from '@/app/actions';
import LogoSvgComponent from '@/components/react-svg-components/logo';
import LogoutSvgComponent from '@/components/react-svg-components/logout';
import { P } from '@/components/typography/text';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { routeConsts } from '@/consts/routing.const';

import { Button } from '../ui/button';
import { ClientMenuButton } from './client-menu-button';
import { UserAvatar } from './user-avatar';

getConfig();

const items = [
  {
    title: 'Home',
    icon: Home,
  },
  {
    title: 'Quincy',
    url: routeConsts.quincyDashboard,
    icon: Inbox,
  },
  {
    title: 'Calendar',
    icon: Calendar,
  },
  {
    title: 'Search',
    icon: Search,
  },
  {
    title: 'Settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader />
      <SidebarContent className="p-7 pt-2 sm:px-4 lg:px-7">
        <LogoSvgComponent className="z-10 text-white" desc="QunoMedical Logo" />
        <SidebarGroup className="mt-8">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <ClientMenuButton url={item.url}>
                    <a href={item?.url || '#'} className="p-3.5">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </ClientMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex w-full flex-col gap-4 p-7 pb-10">
        <form action={signOutAction}>
          <Button className="bg-transparent text-border-input hover:bg-transparent hover:text-white">
            <LogoutSvgComponent />
            <P className="text-lg">Logout</P>
          </Button>
        </form>
        <Separator />
        <UserAvatar></UserAvatar>
      </SidebarFooter>
    </Sidebar>
  );
}
