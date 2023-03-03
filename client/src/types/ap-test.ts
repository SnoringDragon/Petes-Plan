export type ApiAPTest = {
    _id: string,
    name: string,
    credits: {
        score: 1 | 2 | 3 | 4 | 5,
        courses: {
            courseID: string,
            subject: string
        }[]
    }[]
};

export type ApiUserAPTest = {
    test: ApiAPTest,
    score: 1 | 2 | 3 | 4 | 5
};
