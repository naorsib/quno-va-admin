import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import LogoSvgComponent from '@/components/react-svg-components/logo';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full max-w-3xl flex-col">
        <div className="sticky left-0 top-0 flex min-h-28 w-full flex-row items-end justify-center bg-primary py-5 md:hidden">
          <div className="absolute left-2 flex">
            <SidebarTrigger />
          </div>
          <LogoSvgComponent
            className="scale-75 text-white md:hidden"
            desc="QunoMedical Logo"
          />
        </div>
        <div className="flex w-full flex-col px-3 md:mt-3 md:px-8">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
