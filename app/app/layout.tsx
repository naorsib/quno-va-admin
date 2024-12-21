import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="flex max-w-7xl flex-col items-start gap-12">
        {children}
      </div>
    </SidebarProvider>
  );
}
