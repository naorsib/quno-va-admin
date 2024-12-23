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
      <div className="flex w-full max-w-3xl flex-col px-3">{children}</div>
    </SidebarProvider>
  );
}
