export type Grade = {
    course: {
        courseID: string,
            subject: string,
            grades: {
            category: string,
                capped: boolean,
                weight: number,
                assignments: {
                name: string,
                    numerator: number,
                    denominator: number
            }[]
        }[]
    }
};
