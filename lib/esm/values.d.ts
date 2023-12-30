import { BoardCharArray } from './types';
type CharacterCode = {
    [key in string | number]: number;
};
export declare const characterCode: CharacterCode;
export declare const specialChar: string[];
export declare const LINE_LENGTH = 22;
export declare const emptyBoard: BoardCharArray;
export {};
