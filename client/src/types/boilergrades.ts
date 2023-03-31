export const BOILERGRADES_GRADES = {
    "a": "A",
    "a_minus": "A-",
    "a_plus": "A+",
    "au": "AU",
    "b": "B",
    "b_minus": "B-",
    "b_plus": "B+",
    "c": "C",
    "c_minus": "C-",
    "c_plus": "C+",
    "d": "D",
    "d_minus": "D-",
    "d_plus": "D+",
    "e": "E",
    "f": "F",
    // "fn": "FN",
    "i": "I",
    "i_f": "IF",
    "n": "N",
    "ns": "NS",
    "p": "P",
    "p_i": "PI",
    "s": "S",
    "s_i": "SI",
    "u": "U",
    "w": "W",
    "w_f": "WF",
    "w_n": "WN",
    "w_u": "WU",
} as const;

export type Boilergrade = {
    id: number,
    subject: string,
    subject_desc: string,
    course_num: number,
    title: string,
    academic_period: string,
    academic_period_desc: string,
    section: string,
    crn: number,
    instructor: string,
} & { [key in keyof typeof BOILERGRADES_GRADES]: string | null };