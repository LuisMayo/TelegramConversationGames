export interface PressTheButtonResponse {
    success: boolean;
    dilemma: Dilemma;
}

export interface Dilemma {
    id:        number;
    txt1:      string;
    txt2:      string;
    yes:       number;
    no:        number;
    confirmed: 0 | 1;
}
