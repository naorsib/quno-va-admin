import { useTranslations } from 'next-intl';

import { signOutAction } from '@/app/actions';
import CalendarMenuSvgComponent from '@/components/react-svg-components/calendar-menu';
import ClinicMenuSvgComponent from '@/components/react-svg-components/clinic-menu';
import HomeMenuSvgComponent from '@/components/react-svg-components/home-menu';
import LogoSvgComponent from '@/components/react-svg-components/logo';
import LogoutSvgComponent from '@/components/react-svg-components/logout';
import PatientMenuSvgComponent from '@/components/react-svg-components/patient-menu';
import RobotMenuSvgComponent from '@/components/react-svg-components/robot-menu';
import TasksMenuSvgComponent from '@/components/react-svg-components/tasks-menu';
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
      icon: HomeMenuSvgComponent,
    },
    {
      title: tSidebar('quincy'),
      url: routeConsts.quincyDashboard,
      icon: RobotMenuSvgComponent,
    },
    {
      title: tSidebar('clinic'),
      icon: ClinicMenuSvgComponent,
    },
    {
      title: tSidebar('calendar'),
      icon: CalendarMenuSvgComponent,
    },
    {
      title: tSidebar('patients'),
      icon: PatientMenuSvgComponent,
    },
    {
      title: tSidebar('tasks'),
      icon: TasksMenuSvgComponent,
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
                      <item.icon height="22" width="20" />
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
