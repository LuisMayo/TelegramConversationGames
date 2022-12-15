export interface TruthOrDareQuestions {
    id:      string;
    level:   string;
    summary: string;
    time:    string;
    turns:   string;
    type:    Type;
}

export enum Type {
    Truth = "truth",
    Starter ="starter"
}
