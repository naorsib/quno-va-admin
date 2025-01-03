import LogoSvgComponent from '@/components/react-svg-components/logo';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-auto bg-primary">
      <div className="flex flex-col items-center gap-12 p-2 pt-9 md:px-6">
        <LogoSvgComponent className="text-white" />
        {children}
      </div>
    </div>
  );
}
