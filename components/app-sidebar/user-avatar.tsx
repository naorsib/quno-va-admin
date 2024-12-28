import Image from 'next/image';

import { P } from '@/components/typography/text';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/server';

type Props = {
  status: string;
};

export async function UserAvatar({ status }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const first_name = user?.user_metadata.first_name as string;
  const last_name = user?.user_metadata.first_name as string;
  const firstLetter = first_name.slice(0, 1);
  const full_name = `${first_name} ${last_name}`;
  const image: string | undefined =
    user?.user_metadata.avatar_url || user?.user_metadata.picture;

  return (
    <div className="relative flex flex-row items-center gap-2 truncate">
      <Avatar>
        {image && (
          <Image
            fill={true}
            loading="lazy"
            alt="User Image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={image}
          />
        )}

        {/* <AvatarImage src={image} alt="@shadcn" /> */}
        {!image && <AvatarFallback>{firstLetter}</AvatarFallback>}
      </Avatar>
      <div className="text-white">
        <P fontFamily="roboto" className="text-lg font-bold">
          {full_name}
        </P>
        <P fontFamily="roboto">{status}</P>
      </div>

      <div className="absolute bottom-1 left-7 h-3.5 w-3.5 rounded-full border-2 border-primary/70 bg-success"></div>
    </div>
  );
}
