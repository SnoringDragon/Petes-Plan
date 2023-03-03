export type Degree = {
    _id: string,
    name: string,
    type: 'concentration' | 'minor' | 'major',
    requirements: {
        courseID: string,
        subject: string
    }[],
    concentrations: string[]
};