import { AxiosResponse } from 'axios';
import { APIOptions, LocalAPIConfig, LocalPostResponse, BoardCharArray } from './types';
import { isSpecial, containsEscapeCharacter, containsNonDisplayCharacter, convertToCharCodeArray, makeBoard, characterArrayFromString, isValidBoard, convertBoardLayoutToString } from './sharedFunctions';
declare class VestaboardLocalAPI {
    private localAPIEnablementToken?;
    private baseUrl;
    private localAPIKey?;
    private localIPAddress?;
    constructor(config: LocalAPIConfig);
    private initialize;
    isLocalKeyOrEnablementSet(): boolean;
    isConfiguredWithIPAndKey(): boolean;
    getLocalIP(): string;
    request(options: APIOptions): Promise<AxiosResponse>;
    enableAndGetLocalKey(token: string): Promise<string>;
    postMessage(postMessage: BoardCharArray): Promise<LocalPostResponse>;
    readFromBoard(): Promise<BoardCharArray>;
    clearBoardTo(char: string): Promise<LocalPostResponse>;
    isSpecial: typeof isSpecial;
    containsEscapeCharacter: typeof containsEscapeCharacter;
    containsNonDisplayCharacter: typeof containsNonDisplayCharacter;
    convertToCharCodeArray: typeof convertToCharCodeArray;
    makeBoard: typeof makeBoard;
    characterArrayFromString: typeof characterArrayFromString;
    isValidBoard: typeof isValidBoard;
    convertBoardLayoutToString: typeof convertBoardLayoutToString;
}
export default VestaboardLocalAPI;
