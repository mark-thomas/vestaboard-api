import { BoardCharArray } from './types';
import { IKeyCode } from './VB-Original-Types';
export declare function characterArrayFromString(string: string): BoardCharArray;
export declare function isSpecial(char: string): boolean;
export declare function containsEscapeCharacter(input: string): boolean;
export declare function containsNonDisplayCharacter(input: string): boolean;
export declare function convertToCharCodeArray(string: string): IKeyCode[];
export declare function makeBoard(string: string): BoardCharArray;
export declare function isValidBoard(message: BoardCharArray): boolean;
export declare function convertBoardLayoutToString(board: BoardCharArray): string;
interface Difference {
    row: number;
    col: number;
    targetValue: IKeyCode;
}
export declare function createTransitionBoards(startingBoard: BoardCharArray, endingBoard: BoardCharArray): BoardCharArray[];
export declare function logTransitionBoards(transitionBoards: BoardCharArray[]): void;
export declare function findDifferences(board1: BoardCharArray, board2: BoardCharArray): Difference[];
export {};
