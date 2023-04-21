export type ApiAPTest = {
    _id: string,
    name: string,
    credits: {
        score: string,
        courses: {
            courseID: string,
            subject: string
        }[]
    }[]
};

export type ApiUserAPTest = {
    test: ApiAPTest,
    score: string
};
