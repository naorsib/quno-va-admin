import { airBachCaptionWithAudio } from './air_bach';
import { beethovenCaptionWithAudio } from './beethoven';
import { mozartCaptionWithAudio } from './mozart';
import { mozartSonataCaptionWithAudio } from './mozart2';
import { toreadorCaptionWithAudio } from './toreador';

export const captionsMap = {
  schedule_appointment: toreadorCaptionWithAudio,
  cancel_appointment: beethovenCaptionWithAudio,
  reschedule_appointment: beethovenCaptionWithAudio,
  prescription_renewal: airBachCaptionWithAudio,
  get_sick_leave: mozartCaptionWithAudio,
  doctor_call: mozartSonataCaptionWithAudio,
};
