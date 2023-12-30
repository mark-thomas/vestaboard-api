import {
  characterArrayFromString,
  isSpecial,
  containsEscapeCharacter,
  containsNonDisplayCharacter,
  convertToCharCodeArray,
  makeBoard,
  isValidBoard,
  convertBoardLayoutToString,
} from '../src/sharedFunctions';
import { BoardCharArray } from '../src/types';
import { characterCode } from '../src/values';

// Create a sample board character array for testing
const testBoard = [
  [69, 63, 64, 65, 66, 67, 68, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22,
  ],
  [
    23, 24, 25, 26, 36, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 0, 0, 0, 0, 0,
    0, 0,
  ],
  [37, 38, 39, 40, 54, 47, 62, 41, 42, 44, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 46, 44, 49, 52, 53, 55, 56, 59, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 19, 16, 1, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0],
] as BoardCharArray;

const testBoardString =
  '⬜️🟥🟧🟨🟩🟦🟪⬛️              ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890       !@#$%&°()-=               +-;\'",./                  SPACE         ';
describe('sharedFunctions', () => {
  describe('offline characterArrayFromString', () => {
    it('should convert a string to a character array', () => {
      const result = characterArrayFromString(
        'Sample test string *greenBlock with a special character!'
      );
      expect(isValidBoard(result)).toBe(true);
    });
  });

  describe('offline isSpecial', () => {
    it('should return true for a special character', () => {
      const result = isSpecial('*redBlock');
      expect(result).toBe(true);
    });

    it('should return false for a non-special character', () => {
      const result = isSpecial('a');
      expect(result).toBe(false);
    });
  });

  describe('offline containsEscapeCharacter', () => {
    it('should return true if the input contains an escape character offline', () => {
      const result = containsEscapeCharacter('test*');
      expect(result).toBe(true);
    });

    it('should return false if the input does not contain an escape character offline', () => {
      const result = containsEscapeCharacter('test');
      expect(result).toBe(false);
    });
  });

  describe('offline containsNonDisplayCharacter', () => {
    it('should return true if the input contains a non-display character offline', () => {
      const result = containsNonDisplayCharacter('test^');
      expect(result).toBe(true);
    });

    it('should return false if the input does not contain a non-display character offline', () => {
      const result = containsNonDisplayCharacter('test');
      expect(result).toBe(false);
    });
  });

  describe('offline convertToCharCodeArray', () => {
    it('should convert a string to a character code array offline', () => {
      const result = convertToCharCodeArray('test');
      expect(result).toBeInstanceOf(Array);
      for (const char of result) {
        expect(typeof char).toBe('number');
        expect(Object.values(characterCode).includes(char)).toBe(true);
      }
    });
  });

  describe('offline makeBoard', () => {
    it('should create a board from a string offline', () => {
      const result = makeBoard(
        'Hello world! *redBlock, *greenBlock this is a test *return 1234589320'
      );
      expect(result).toEqual(expect.any(Array));
      expect(isValidBoard(result)).toBe(true);
    });
  });

  describe('offline isValidBoard', () => {
    it('should return true for a valid board offline', () => {
      const board = Array(6).fill(Array(22).fill(0)) as BoardCharArray;
      const result = isValidBoard(board);
      expect(result).toBe(true);
    });
    it('should return true for an valid board of some complexity offline', () => {
      const result = isValidBoard(testBoard);
      expect(result).toBe(true);
    });
    it('should return false for an invalid board offline', () => {
      const board = Array(5).fill(Array(22).fill(0)) as BoardCharArray;
      const result = isValidBoard(board);
      expect(result).toBe(false);
    });
  });

  describe('offline convertBoardLayoutToString offline', () => {
    it('should convert a board layout to a string', () => {
      const result = convertBoardLayoutToString(testBoard);
      expect(result).toEqual(testBoardString);
    });
  });
});
