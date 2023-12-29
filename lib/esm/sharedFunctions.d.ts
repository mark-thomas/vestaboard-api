import { BoardCharArray } from './values';
export declare function characterArrayFromString(string: string): BoardCharArray;
export declare function isSpecial(char: string): boolean;
export declare function containsEscapeCharacter(input: string): boolean;
export declare function containsNonDisplayCharacter(input: string): boolean;
export declare function convertToCharCodeArray(string: string): number[];
export declare function makeBoard(string: string): BoardCharArray;
export declare function isValidBoard(message: BoardCharArray): boolean;
