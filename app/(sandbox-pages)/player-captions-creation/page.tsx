import { LandingHeroWrapper } from '@/components/landing-page/landing-hero-wrapper';
import EditAudioBar from '@/components/ui/audio-captions-player/captions-editor/edit-audio-bar';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

type HeaderTrans = GenericTrans<keyof typeof en.Landing.header>;

export default async function Index() {
  return (
    <>
      <div className={cn('w-full', `mt-20`)}>
        <LandingHeroWrapper className="items-center bg-primary">
          <div className="z-10 flex w-full flex-col">
            <EditAudioBar></EditAudioBar>
          </div>
        </LandingHeroWrapper>
      </div>
      <Toaster />
    </>
  );
}
