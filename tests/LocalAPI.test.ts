import dotenv from 'dotenv';

import { characterCode } from './../src/values';
import { VestaLocal, createVestaboard } from '../src/index';
import { characterArrayFromString, isValidBoard } from '../src/sharedFunctions';
import { LocalAPIConfig, VestaboardControlMode } from '../src/types';
import { BoardCharArray } from '../src/values';
dotenv.config();

const localConfig: LocalAPIConfig = {
  mode: VestaboardControlMode.Local,
  localIPAddress: process.env.LOCAL_IP_ADDRESS as string,
  localApiKey: process.env.LOCAL_API_KEY as string,
};
// // Using the rwConfig we are going to create a test suite similar to the one
// // above for subscriptions, but using the RW API
describe('vestaboard local API tests', () => {
  let vestaLocal: VestaLocal;

  beforeAll(() => {
    vestaLocal = createVestaboard(localConfig) as VestaLocal;
  });

  test('createVestaboard returns a VestaLocal', () => {
    expect(vestaLocal).toBeInstanceOf(VestaLocal);
  });

  test('Vesta object has either an enablement key or a local key', () => {
    expect(vestaLocal.isLocalKeyOrEnablementSet()).toBeTruthy();
  });

  test('Vesta object has a local ip address', () => {
    expect(vestaLocal.getLocalIP()).toMatch(localConfig.localIPAddress);
  });
  // A test for isLocalKeyOrEnablementSet()
  test('Vesta object is configured', () => {
    expect(vestaLocal.isConfiguredWithIPAndKey()).toBeTruthy();
  });

  test('Vesta object has request method', () => {
    expect(vestaLocal.request).toBeInstanceOf(Function);
  });

  test('Vesta object has postMessage method', () => {
    expect(vestaLocal.postMessage).toBeInstanceOf(Function);
  });

  test('Vesta object has characterArrayFromString method', () => {
    expect(vestaLocal.characterArrayFromString).toBeInstanceOf(Function);
  });

  test('Vesta object has clearBoardTo method', () => {
    expect(vestaLocal.clearBoardTo).toBeInstanceOf(Function);
  });

  test('Vesta object has isSpecial method', () => {
    expect(vestaLocal.isSpecial).toBeInstanceOf(Function);
  });
});

describe('vestaboardLocalAPI post tests requiring real key and IP', () => {
  let vestaLocal: VestaLocal;
  let helloWorld: string;
  let characterHelloWorld: BoardCharArray;
  let existingBoard: BoardCharArray;

  beforeAll(() => {
    vestaLocal = createVestaboard(localConfig) as VestaLocal;
    helloWorld = `Hello World!\n${new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'long',
    })}`;
    characterHelloWorld = characterArrayFromString(helloWorld);
  });

  test(`read current message results in last posted message`, async () => {
    const currentMessage = await vestaLocal.readFromBoard();
    // The message needs to be a valid BoardCharArray

    expect(isValidBoard(currentMessage)).toBeTruthy();
    existingBoard = currentMessage;
  });

  test(`make a one bit change to the existing board`, async () => {
    // if there is a current message change one bit (5,21) to 68
    let oneBitChange: BoardCharArray;
    const randomKey =
      Object.keys(characterCode)[
        Math.floor(Math.random() * Object.keys(characterCode).length)
      ];
    const useChar = characterCode[randomKey]; // Get the number value associated with the random key
    console.log(`useChar: ${useChar}`);
    if (existingBoard) {
      oneBitChange = existingBoard;
      oneBitChange[5][21] = useChar;
    } else {
      const currentMessage = await vestaLocal.readFromBoard();
      existingBoard = currentMessage;
      oneBitChange = existingBoard;
      oneBitChange[5][21] = useChar;
    }
    const postResponse = await vestaLocal.postMessage(oneBitChange);
    expect(postResponse).toHaveProperty('ok');
  });

  test(`post hello world to local board`, async () => {
    const postResponse = await vestaLocal.postMessage(characterHelloWorld);
    expect(postResponse).toHaveProperty('ok');
  });

  test(`local API fails on a text/string based message`, async () => {
    try {
      // This test should fail because the local API does not support text based
      // messages and will throw an error
      // create a version of characterHelloWorld that has 4 lines
      const newArray = characterHelloWorld.slice(0, -3);
      await vestaLocal.postMessage(newArray as BoardCharArray);
      fail('Expected an error to be thrown');
    } catch (error) {
      // Handle the error here
      expect(error).toBeDefined();
    }
  });
});
