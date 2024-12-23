export const toreadorCaptions = [
  {
    id: 1,
    text: 'Toreador Song from Carmen',
    startTime: 0,
    endTime: 2,
    callEventType: 'appointment_cancelled',
    time: '13:10 Today',
    type: 'call_event' as const,
  },
  {
    id: 2,
    text: 'Incoming Call from +48 456 678 99 (Olaf Meier)',
    startTime: 2,
    endTime: 6,
    type: 'dial_event' as const,
  },
  {
    id: 3,
    text: 'Señors, señors car avec les soldats',
    startTime: 6,
    endTime: 10,
    type: 'ai' as const,
  },
  {
    id: 4,
    text: "Oui, les toreros, peuvent s'entendre",
    startTime: 10,
    endTime: 14,
    type: 'ai' as const,
  },
  {
    id: 5,
    text: 'Pour plaisirs, pour plaisirs',
    startTime: 14,
    endTime: 18,
    type: 'ai' as const,
  },
  {
    id: 6,
    text: 'Ils ont les combats!',
    startTime: 18,
    endTime: 22,
    type: 'ai' as const,
  },
  {
    id: 7,
    text: 'Chorus joins',
    startTime: 22,
    endTime: 24,
    callEventType: 'appointment_scheduled',
    time: '13:30 Today',
    type: 'call_event' as const,
  },
  {
    id: 8,
    text: 'Toréador, en garde!',
    startTime: 24,
    endTime: 28,
    type: 'user' as const,
  },
  {
    id: 9,
    text: 'Toréador, Toréador!',
    startTime: 28,
    endTime: 32,
    type: 'user' as const,
  },
  {
    id: 10,
    text: 'Et songe bien, oui, songe en combattant',
    startTime: 32,
    endTime: 36,
    type: 'user' as const,
  },
  {
    id: 11,
    text: "Qu'un œil noir te regarde",
    startTime: 36,
    endTime: 40,
    type: 'user' as const,
  },
  {
    id: 12,
    text: "Et que l'amour t'attend",
    startTime: 40,
    endTime: 44,
    type: 'user' as const,
  },
  {
    id: 13,
    text: "Toréador, l'amour, l'amour t'attend!",
    startTime: 44,
    endTime: 48,
    type: 'user' as const,
  },
];

export const captionsMap = {
  appointment_booking: {
    captions: toreadorCaptions,
    audioSrc:
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Toreador_song_cleaned.ogg',
  },
  appointment_booking2: {
    captions: toreadorCaptions,
    audioSrc:
      'https://upload.wikimedia.org/wikipedia/commons/4/40/Toreador_song_cleaned.ogg',
  },
};
