export const SCHEDULE_TYPES = {
    LEC: 'Lecture',
    REC: 'Recitation',
    PRS: 'Presentation',
    LAB: 'Laboratory',
    LBP: 'Laboratory Preparation',
    CLN: 'Clinic',
    SD: 'Studio',
    EX: 'Experiential',
    RES: 'Research',
    IND: 'Individual Study',
    DIS: 'Distance Learning',
    PSO: 'Practice Study Observation',
    PS5: 'Travel Time'
} as const;

export const SCHEDULE_ORDER = Object.fromEntries([
    'LEC',
    'REC',
    'LAB',
    'LBP',
    'PRS',
    'RES',
    'IND',
    'PSO',
    'EX',
    'SD',
    'CLN',
    'DIS',
    'PS5'
].map((val, i) => [val, i]));
