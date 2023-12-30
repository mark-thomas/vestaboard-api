import dotenv from 'dotenv';
dotenv.config();
import { VestaRW, createVestaboard } from '../src/index';
import { characterArrayFromString } from '../src/sharedFunctions';
import {
  RWAPIConfig,
  VestaboardControlMode,
  BoardCharArray,
} from '../src/types';

const rwConfig: RWAPIConfig = {
  apiReadWriteKey: process.env.RW_API_KEY as string,
};
// // Using the rwConfig we are going to create a test suite similar to the one
// // above for subscriptions, but using the RW API
describe('vestaboardRWAPI tests', () => {
  let vestaRW: VestaRW;
  let helloWorld: string;
  let characterHelloWorld: BoardCharArray;

  beforeAll(() => {
    vestaRW = createVestaboard(VestaboardControlMode.RW, rwConfig) as VestaRW;
    helloWorld = `Hello World!\n${new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'long',
    })}`;
    characterHelloWorld = characterArrayFromString(helloWorld);
  });

  test('offline: createVestaboard returns a VestaRW', () => {
    expect(vestaRW).toBeInstanceOf(VestaRW);
  });

  test('offline: Vesta object has baseUrl property', () => {
    expect(vestaRW.isReadWriteKeySet).toBeTruthy();
  });

  test('offline: Vesta object has request method', () => {
    expect(vestaRW.request).toBeInstanceOf(Function);
  });

  test('offline: Vesta object has postMessage method', () => {
    expect(vestaRW.postMessage).toBeInstanceOf(Function);
  });

  test('offline: Vesta object has characterArrayFromString method', () => {
    expect(vestaRW.characterArrayFromString).toBeInstanceOf(Function);
  });

  test('offline: Vesta object has clearBoardTo method', () => {
    expect(vestaRW.clearBoardTo).toBeInstanceOf(Function);
  });

  test('offline: Vesta object has isSpecial method', () => {
    expect(vestaRW.isSpecial).toBeInstanceOf(Function);
  });
  test('offline: vesta object has convertToCharCodeArray method', () => {
    expect(vestaRW.convertToCharCodeArray).toBeInstanceOf(Function);
  });
});

describe('vestaboardRWAPI post tests with rate limiting', () => {
  let vestaRW: VestaRW;
  let helloWorld: string;
  let characterHelloWorld: BoardCharArray;
  let testCounter = 0;

  beforeAll(() => {
    vestaRW = createVestaboard(VestaboardControlMode.RW, rwConfig) as VestaRW;
    helloWorld = `Hello World!\n${new Date().toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'long',
    })}`;
    characterHelloWorld = characterArrayFromString(helloWorld);
  });

  test('Can post a character message and gets correct response', async () => {
    testCounter++;
    // const helloWorld = `Hello World!${new Date().toLocaleString('en-US', {
    //   dateStyle: 'short',
    //   timeStyle: 'long',
    // })}`;
    // const characterHelloWorld = characterArrayFromString(helloWorld);
    if (characterHelloWorld) {
      const postResponse = await vestaRW.postMessage(characterHelloWorld);
      expect(postResponse).toHaveProperty('id');
      expect(postResponse).toHaveProperty('status');
      expect(postResponse).toHaveProperty('created');
    }
  }, 20_000);

  test(`read current message results in last posted message`, async () => {
    testCounter++;
    if (testCounter > 1) {
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
    const message = await vestaRW.readFromBoard();

    expect(message).toHaveProperty('currentMessage');
    expect(message.currentMessage).toHaveProperty('layout');
    expect(message.currentMessage).toHaveProperty('id');
    const { layout } = message.currentMessage;
    // const parsedLayout = JSON.parse(layout);
    expect(layout).toEqual(characterHelloWorld);
  }, 20_000);

  test('can post a text based message and gets correct response', async () => {
    testCounter++;
    if (testCounter > 1) {
      await new Promise((resolve) => setTimeout(resolve, 15000 * 2));
    }
    const postResponse = await vestaRW.postMessage('This is a test message');
    expect(postResponse).toHaveProperty('id');
    expect(postResponse).toHaveProperty('status');
    expect(postResponse).toHaveProperty('created');
  }, 65_000);
});
