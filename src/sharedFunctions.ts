import { BoardCharArray, Line } from './types';
import {
  characterCode,
  specialChar,
  emptyBoard,
  LINE_LENGTH,
  characterCodeArray,
} from './values';
import { IKeyCode } from './VB-Original-Types';

export function characterArrayFromString(string: string): BoardCharArray {
  const charBoard = makeBoard(string);
  return charBoard;
}

export function isSpecial(char: string): boolean {
  return specialChar.includes(char);
}
// function isEscapeCharacter(char: string): boolean {
//   return char === EscapeCharacter;
// }
// function startsWithEscapeCharacter(word: string): boolean {
//   return word.startsWith(EscapeCharacter);
// }
export function containsEscapeCharacter(input: string): boolean {
  const test = /[*]/g;
  return input.search(test) >= 0; // Index of first match
}
// function containsInvalidCharactersEsc(input: string): boolean {
//   const test = /^(?:[A-Za-z0-9!@#$\(\)\-*+&=;:'\"%,./?°\s]+)$/g;
//   return input.search(test) < 0; // -1 for no match
// }
export function containsNonDisplayCharacter(input: string): boolean {
  const test = /^(?:[A-Za-z0-9!@#$\(\)\-+&=;:'\"%,./?°\s]*)$/g;
  const result = input.search(test);
  return result < 0; // -1 for no match
}

// export function containsNonDisplayCharacter(input: string): boolean {
//   const test = /^(?:[A-Za-z0-9!@#$\(\)\-+&=;:'\"%,./?°\s]+)$/g;
//   const match = input.match(test);
//   if (!match) {
//     const invalidCharacter = input.match(
//       /[^A-Za-z0-9!@#$\(\)\-+&=;:'\"%,./?°\s]/
//     );
//     if (invalidCharacter) {
//       console.log('Invalid character:', invalidCharacter[0]);
//     }
//     return false;
//   }
//   return true;
// }
export function convertToCharCodeArray(string: string): IKeyCode[] {
  // Does this string use an the escape character?
  const usesEscape = containsEscapeCharacter(string);
  // Does this string contain any invalid characters?
  const containsInvalidCharacter = containsNonDisplayCharacter(string);
  // For any `\n` we replace it with ` *return ` so that we can split on spaces
  // and get the correct number of elements.
  const stringWithReturn = string.replace(/\n/g, ' *return ');

  // If we remove the escape character, is the string now valid?

  let containsInvalidWithoutEscapeChar = false;

  if (containsInvalidCharacter) {
    // This string is invalid
    const cleanedString = stringWithReturn.replace(/[*]/g, '');
    containsInvalidWithoutEscapeChar =
      containsNonDisplayCharacter(cleanedString);
  }

  if (containsInvalidWithoutEscapeChar) {
    // This string is invalid, even without the escape character;
    throw new Error(
      'Input contains one or more invalid characters that are not the escape character.'
    );
  }
  // Build our word list
  const wordList = stringWithReturn.split(' ');
  let charCount = 0;
  // And for each word, see if it matches one of our special handling strings,
  // or add the character code to the list
  const mergedLines = wordList
    .map((word, i) => {
      let elements;
      switch (word) {
        case 'degreeSign':
        case 'redBlock':
        case 'orangeBlock':
        case 'yellowBlock':
        case 'greenBlock':
        case 'blueBlock':
        case 'violetBlock':
        case 'whiteBlock':
        case 'blackBlock':
        case '*degreeSign':
        case '*redBlock':
        case '*orangeBlock':
        case '*yellowBlock':
        case '*greenBlock':
        case '*blueBlock':
        case '*violetBlock':
        case '*whiteBlock':
        case '*blackBlock':
          elements = [characterCode[word]];
          charCount += 1;
          break;
        case '*return':
          const charCount_mod_line = charCount % LINE_LENGTH;
          const remaining = LINE_LENGTH - charCount_mod_line;
          if (remaining < LINE_LENGTH) {
            elements = new Array(remaining).fill(0);
            charCount += remaining;
          } else {
            elements = [];
          }
          break;
        case '':
          elements = [0];
          charCount += 1;
          break;
        default:
          // Since we theorteically could have the escape character in the
          // middle of a word, or not used by one of the special characters, we
          // need to be prepared to strip out the '*' if it is used in the default.
          let cleanedWord = word;
          if (usesEscape) {
            cleanedWord = cleanedWord.replace(/[*]/g, '');
          }
          // This might mean that this word is now '' (empty string)
          // ''.split('') will return [] which will be skipped.
          elements = cleanedWord.split('').map((c) => characterCode[c]);
          if (!isSpecial(wordList[i + 1])) {
            elements.push(0);
          }
          charCount += elements.length;
      }
      return [...elements];
    })
    .flat();
  return mergedLines;
}

export function makeBoard(string: string): BoardCharArray {
  const convertedVersion = convertToCharCodeArray(string);
  // Using the emptyBoard array as a structure, map through the converted
  // version to make a set of 6 lines with 22 numeric character codes each
  const newBoard = emptyBoard.map((line, row) => {
    const newLine = line.map((unusedZeroValue, col) => {
      const lineIndex = row * LINE_LENGTH;
      const useCharCode = convertedVersion[col + lineIndex];
      return useCharCode || 0;
    }) as Line;
    return newLine;
  }) as BoardCharArray;
  return newBoard;
}

export function isValidBoard(message: BoardCharArray): boolean {
  if (!Array.isArray(message) || message.length !== 6) {
    return false;
  }

  for (const line of message) {
    if (!Array.isArray(line) || line.length !== 22) {
      return false;
    }

    for (const char of line) {
      if (
        typeof char !== 'number' ||
        !Object.values(characterCode).includes(char)
      ) {
        return false;
      }
    }
  }

  return true;
}

export function convertBoardLayoutToString(board: BoardCharArray): string {
  let boardString = '';
  // Loop through the board
  for (let i = 0; i < board.length; i++) {
    // Loop through each row
    for (let j = 0; j < board[i].length; j++) {
      // Check if the value is 0
      if (board[i][j] === 0) {
        // Check if the rest of the row is also 0
        if (board[i].slice(j).every((value) => value === 0)) {
          // Append newline character to the board string
          boardString += '\n';
          break; // Exit the inner loop
        }
      }
      // Add the character to the string
      boardString += lookupCharacter(board[i][j]);
      if (j === board[i].length - 1) {
        boardString += '\n';
      }
    }
  }
  // Return the string
  return boardString;
}

function lookupCharacter(code: number): string {
  const foundCharacter = characterCodeArray[code];

  switch (foundCharacter) {
    case 'return':
    case '*return':
      return '\n';
    case 'redBlock':
    case '*redBlock':
      return '🟥';
    case 'orangeBlock':
    case '*orangeBlock':
      return '🟧';
    case 'yellowBlock':
    case '*yellowBlock':
      return '🟨';
    case 'greenBlock':
    case '*greenBlock':
      return '🟩';
    case 'blueBlock':
    case '*blueBlock':
      return '🟦';
    case 'violetBlock':
    case '*violetBlock':
      return '🟪';
    case 'whiteBlock':
    case '*whiteBlock':
      return '⬜️';
    case 'blackBlock':
    case '*blackBlock':
      return '⬛️';
    case 'degreeSign':
    case '*degreeSign':
      return '°';
    default:
      return characterCodeArray[code] || '';
  }
}
interface Difference {
  row: number;
  col: number;
  targetValue: IKeyCode;
}

// A wrapper function that uses findDifferences and createTransitionArrays to
// generate a set of boards that transition from the starting board to the end
// state one difference at a time.
export function createTransitionBoards(
  startingBoard: BoardCharArray,
  endingBoard: BoardCharArray, enableLogging:Boolean = false
): BoardCharArray[] {
  const differences = findDifferences(startingBoard, endingBoard);
  const transitionBoards = createTransitionArrays(startingBoard, differences);
  if (enableLogging) { logTransitionBoards(transitionBoards); }
  return transitionBoards;
}
// a function that takes an array of transition boards, and logs the string,
// highlighting the single difference between each board.
export function logTransitionBoards(transitionBoards: BoardCharArray[]): void {
  for (const board of transitionBoards) {
    const boardString = convertBoardLayoutToString(board);
    console.log(boardString);
  }
}

// A find differences function that takes 2 boards and returns an array of
// boards, each with a single difference between the two boards.
export function findDifferences(
  board1: BoardCharArray,
  board2: BoardCharArray
): Difference[] {
  const differences: Difference[] = [];
  // Loop through the board
  for (let i = 0; i < board1.length; i++) {
    // Loop through each row
    for (let j = 0; j < board1[i].length; j++) {
      // Check if the value is 0
      if (board1[i][j] !== board2[i][j]) {
        // Add the difference to the array
        differences.push({
          row: i,
          col: j,
          targetValue: board2[i][j],
        });
      }
    }
  }
  return differences;
}

function createTransitionArrays(
  startingBoard: BoardCharArray,
  differences: Difference[]
): BoardCharArray[] {
  const transitionBoards: BoardCharArray[] = [];
  // Loop through the differences

  for (const difference of differences) {
    // we should use the last created transition board as the starting point for
    // the new difference, if no boards have been created yet, use the
    // startingBoard

    let newBoard: BoardCharArray;

    if (transitionBoards.length > 0) {
      newBoard = transitionBoards[transitionBoards.length - 1].map((line) => {
        return [...line];
      }) as BoardCharArray;
    } else {
      newBoard = startingBoard.map((line) => {
        return [...line];
      }) as BoardCharArray;
    }
    // Update the value at the difference
    newBoard[difference.row][difference.col] = difference.targetValue;
    // Add the new board to the array
    transitionBoards.push(newBoard);
  }
  return transitionBoards;
}
