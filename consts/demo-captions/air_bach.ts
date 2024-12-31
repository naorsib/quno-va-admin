const airBachCaptions = [
  {
    id: 1,
    text: "Bach's Air on the G String",
    startTime: 0,
    endTime: 2,
    callEventType: 'schedule_appointment',
    time: '15:00 Today',
    type: 'call_event' as const,
  },
  {
    id: 2,
    text: 'Incoming Call from +44 20 7123 4567 (Jane Smith)',
    startTime: 2,
    endTime: 5,
    type: 'dial_event' as const,
  },
  {
    id: 3,
    text: 'The piece opens with a gentle violin melody',
    startTime: 5,
    endTime: 10,
    type: 'ai' as const,
  },
  {
    id: 4,
    text: 'Lower strings provide a steady, walking bass line',
    startTime: 10,
    endTime: 15,
    type: 'ai' as const,
  },
  {
    id: 5,
    text: 'The melody flows with graceful ornamentation',
    startTime: 15,
    endTime: 20,
    type: 'ai' as const,
  },
  {
    id: 6,
    text: 'Second violin joins with a counter-melody',
    startTime: 20,
    endTime: 25,
    type: 'ai' as const,
  },
  {
    id: 7,
    text: 'The harmony becomes more complex',
    startTime: 25,
    endTime: 30,
    callEventType: 'cancel_appointment',
    time: '15:30 Today',
    type: 'call_event' as const,
  },
  {
    id: 8,
    text: "The piece's emotional depth is incredible",
    startTime: 30,
    endTime: 35,
    type: 'user' as const,
  },
  {
    id: 9,
    text: 'Such a perfect balance of voices',
    startTime: 35,
    endTime: 40,
    type: 'user' as const,
  },
  {
    id: 10,
    text: 'The melody reaches its highest point',
    startTime: 40,
    endTime: 45,
    type: 'ai' as const,
  },
  {
    id: 11,
    text: 'A moment of harmonic tension',
    startTime: 45,
    endTime: 50,
    type: 'ai' as const,
  },
  {
    id: 12,
    text: 'This performance is so moving',
    startTime: 50,
    endTime: 55,
    type: 'user' as const,
  },
  {
    id: 13,
    text: 'The piece returns to its opening theme',
    startTime: 55,
    endTime: 60,
    type: 'ai' as const,
  },
  {
    id: 14,
    text: 'A perfect example of Baroque grace',
    startTime: 60,
    endTime: 65,
    type: 'user' as const,
  },
];

export const airBachCaptionWithAudio = {
  captions: airBachCaptions,
  audioSrc:
    'https://upload.wikimedia.org/wikipedia/commons/1/1e/Air_%28Bach%29.ogg',
};
