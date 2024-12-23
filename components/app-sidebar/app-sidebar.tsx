import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { signOutAction } from '@/app/actions';
import LogoSvgComponent from '@/components/react-svg-components/logo';
import LogoutSvgComponent from '@/components/react-svg-components/logout';
import { P } from '@/components/typography/text';
import { Button } from '@/components/ui/button';
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
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

import { ClientMenuButton } from './client-menu-button';
import { UserAvatar } from './user-avatar';

type sidebarKeys = keyof typeof en.Sidebar;
export type SidebarTrans = GenericTrans<sidebarKeys>;

export function AppSidebar() {
  const tSidebar: SidebarTrans = useTranslations('Sidebar');

  const items = [
    {
      title: tSidebar('home'),
      icon: Home,
    },
    {
      title: tSidebar('quincy'),
      url: routeConsts.quincyDashboard,
      icon: Inbox,
    },
    {
      title: tSidebar('calendar'),
      icon: Calendar,
    },
    {
      title: tSidebar('search'),
      icon: Search,
    },
    {
      title: tSidebar('settings'),
      icon: Settings,
    },
  ];
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
          <Button className="mb-3 bg-transparent text-border-input hover:bg-transparent hover:text-white">
            <LogoutSvgComponent desc={tSidebar('logoDesc')} />
            <P className="text-lg">{tSidebar('logout')}</P>
          </Button>
        </form>
        <Separator className="bg-border-input" />
        <UserAvatar status={tSidebar('active')}></UserAvatar>
      </SidebarFooter>
    </Sidebar>
  );
}
