import en from '@/messages/en.json';

export type DiseaseSymptomType = keyof typeof en.Enums.disease_symptom_types;
export type PrescriptionType = keyof typeof en.Enums.prescription_types;
export type CallEventTypes = keyof typeof en.CallEvents;
