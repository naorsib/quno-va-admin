import { H3, P } from '@/components/typography/text';
import { GenericTrans } from '@/lib/utils';
import en from '@/messages/en.json';

type EasySettingBoxesKeys = keyof typeof en.Landing.heros.easySetting.boxes;
type EastSettingBoxesFieldsKeys =
  keyof typeof en.Landing.heros.easySetting.boxes.setUpPhone;

export type BoxFieldsTrans =
  GenericTrans<`${EasySettingBoxesKeys}.${EastSettingBoxesFieldsKeys}`>;

type InfoBoxProps = {
  tr: BoxFieldsTrans;
  boxName: EasySettingBoxesKeys;
  number: number;
};

export function EasySettingsInfoBox({ tr, boxName, number }: InfoBoxProps) {
  return (
    <div className="flex w-full flex-row gap-3 rounded-2xl bg-white p-6 shadow-heroCardShadow">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
        <P className="font-semibold" fontFamily="poppins">
          {number}
        </P>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <H3 className="text-xl font-semibold">{tr(`${boxName}.title`)}</H3>
        <P className="text-lg/6">{tr(`${boxName}.text`)}</P>
      </div>
    </div>
  );
}
