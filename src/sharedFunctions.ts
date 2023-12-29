import {
  BoardCharArray,
  characterCode,
  specialChar,
  emptyBoard,
  LINE_LENGTH,
  Line,
} from './values';

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
  const test = /^(?:[A-Za-z0-9!@#$\(\)\-+&=;:'\"%,./?°\s]+)$/g;
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
export function convertToCharCodeArray(string: string): number[] {
  // Does this string use an the escape character?
  const usesEscape = containsEscapeCharacter(string);
  // Does this string contain any invalid characters?
  const containsInvalidCharacter = containsNonDisplayCharacter(string);
  // For any `\n` we replace it with ` *return ` so that we can split on spaces
  // and get the correct number of elements.
  const stringWithReturn = string.replace(/\n/g, ' *return ');

  // If we remove the escape character, is the string now valid?
  const cleanedString = stringWithReturn.replace(/[*]/g, '');

  const containsInvalidWithoutEscapeChar =
    containsNonDisplayCharacter(cleanedString);

  // if (containsInvalidCharacter) {
  //   // This string is invalid
  //   // throw new Error('Input contains one or more invalid characters.');

  // }

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
