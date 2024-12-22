import { H3, H4, P } from '@/components/typography/text';
import en from '@/messages/en.json';
import { GenericTrans } from '@/types/translations';

type BenefitBoxesKeys = keyof typeof en.Landing.heros.yourBenefits.boxes;
type BenefitBoxesFieldsKeys =
  keyof typeof en.Landing.heros.yourBenefits.boxes.costSave;

export type BoxFieldsTrans =
  GenericTrans<`${BenefitBoxesKeys}.${BenefitBoxesFieldsKeys}`>;

type InfoBoxProps = {
  tr: BoxFieldsTrans;
  boxName: BenefitBoxesKeys;
};

export function YourBenefitsInfoBox({ tr, boxName }: InfoBoxProps) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl bg-white p-6 shadow-heroCardShadow lg:w-80">
      <H3 className="text-4xl">{tr(`${boxName}.title`)}</H3>
      <H4 className="text-xl">{tr(`${boxName}.subtitle`)}</H4>
      <P className="text-lg/6">{tr(`${boxName}.text`)}</P>
    </div>
  );
}
