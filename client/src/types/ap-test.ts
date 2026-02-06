export type ApiAPTest = {
    _id: string,
    name: string,
    credits: {
        score: string | null,
        courses: {
            courseID: string,
            subject: string
        }[]
    }[],
    type: string
};

export type ApiUserAPTest = {
    test: ApiAPTest,
    score: string | null
};
