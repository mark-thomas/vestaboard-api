import { BoardCharArray } from './types';
declare type CharacterCode = {
    [key in string | number]: number;
};
export declare const characterCode: CharacterCode;
export declare const characterCodeArray: (string | undefined)[];
export declare const specialChar: string[];
export declare const LINE_LENGTH = 22;
export declare const emptyBoard: BoardCharArray;
export {};
