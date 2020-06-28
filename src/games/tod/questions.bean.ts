export interface TruthOrDareQuestions {
    id:      string;
    level:   string;
    summary: string;
    time:    string;
    turns:   string;
    type:    Type;
}

export enum Type {
    Dare = "Dare",
    Truth = "Truth",
}
