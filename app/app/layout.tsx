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
      {/* className="fixed left-0 top-0 z-10 flex h-24 w-full flex-row items-center justify-center bg-sidebarGradient md:absolute md:left-5 md:top-14 md:w-fit md:bg-none lg:left-10" */}
      <div className="fixed left-0 top-0 z-10 flex h-24 w-full flex-row items-center justify-center bg-sidebarGradient md:absolute md:left-5 md:top-14 md:w-fit md:bg-none lg:left-10">
        <div className="absolute left-2 md:hidden">
          <SidebarTrigger />
        </div>
        <LogoSvgComponent
          className="text-white md:hidden"
          desc="QunoMedical Logo"
        />
      </div>

      <div className="mt-24 flex w-full max-w-3xl flex-col px-3 md:mt-0">
        {children}
      </div>
    </SidebarProvider>
  );
}
