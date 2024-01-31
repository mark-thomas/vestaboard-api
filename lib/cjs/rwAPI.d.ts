import { AxiosResponse } from 'axios';
import { APIOptions, RWAPIConfig, RWBoardParsed, RWMesageResponse, BoardCharArray } from './types';
import { isSpecial, containsEscapeCharacter, containsNonDisplayCharacter, convertToCharCodeArray, makeBoard, characterArrayFromString, isValidBoard, convertBoardLayoutToString } from './sharedFunctions';
declare class VestaboardRWAPI {
    private readWriteKey;
    baseUrl: string;
    constructor(config: RWAPIConfig);
    isReadWriteKeySet(): boolean;
    request(options: APIOptions): Promise<AxiosResponse>;
    postMessage(postMessage: string | BoardCharArray): Promise<RWMesageResponse>;
    readFromBoard(): Promise<RWBoardParsed>;
    clearBoardTo(char: string): Promise<RWMesageResponse>;
    isSpecial: typeof isSpecial;
    containsEscapeCharacter: typeof containsEscapeCharacter;
    containsNonDisplayCharacter: typeof containsNonDisplayCharacter;
    convertToCharCodeArray: typeof convertToCharCodeArray;
    makeBoard: typeof makeBoard;
    characterArrayFromString: typeof characterArrayFromString;
    isValidBoard: typeof isValidBoard;
    convertBoardLayoutToString: typeof convertBoardLayoutToString;
    emptyBoard: BoardCharArray;
}
export default VestaboardRWAPI;
