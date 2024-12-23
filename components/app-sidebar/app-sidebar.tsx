import {
  ArrowLeft,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from 'lucide-react';
import getConfig from 'next/config';

import { signOutAction } from '@/app/actions';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { routeConsts } from '@/consts/routing.const';

import LogoSvgComponent from '../react-svg-components/logo';
import { ClientMenuButton } from './client-menu-button';

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
      <SidebarFooter className="w-full p-7">
        <form action={signOutAction}>
          <SidebarMenuButton
            type="submit"
            className="hover:text-primary-foreground"
          >
            <ArrowLeft />

            <span>Logout</span>
          </SidebarMenuButton>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
