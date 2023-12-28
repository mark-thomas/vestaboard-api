type CharacterCode = {
    [key in string | number]: number;
};
export declare const characterCode: CharacterCode;
export declare const specialChar: string[];
export declare const LINE_LENGTH = 22;
export type Line = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
export type BoardCharArray = [Line, Line, Line, Line, Line, Line];
export declare const emptyBoard: BoardCharArray;
export {};
