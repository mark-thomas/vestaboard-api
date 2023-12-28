// Vesta.test.ts
import dotenv from 'dotenv';
dotenv.config();

import { VestaSubscription, createVestaboard } from '../src/index';

import { SubscriptionAPIConfig, VestaboardControlMode } from '../src/types';
import { characterCode } from '../src/values';

const subscriptionConfig: SubscriptionAPIConfig = {
  mode: VestaboardControlMode.Subscription,
  apiKey: process.env.SUBSCRIPTION_API_KEY as string,
  apiSecret: process.env.SUBSCRIPTION_API_SECRET as string,
};
// let vesta: VestaSubscription;

describe('VestaSubscription tests', () => {
  let vesta: VestaSubscription;

  beforeAll(() => {
    vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
  });

  test('createVestaboard returns a VestaSubscription', () => {
    // const vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
    expect(vesta).toBeInstanceOf(VestaSubscription);
  });

  test('Vesta object has baseUrl property', () => {
    // const vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
    expect(vesta.baseUrl).toBeDefined();
  });

  test('Vesta object has request method', () => {
    expect(vesta.request).toBeInstanceOf(Function);
  });

  test('Vesta object has getSubscriptions method', () => {
    // const vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
    expect(vesta.getSubscriptions).toBeInstanceOf(Function);
  });

  test('Vesta object has postMessage method', () => {
    // const vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
    expect(vesta.postMessage).toBeInstanceOf(Function);
  });

  test('Vesta object has characterArrayFromString method', () => {
    // const vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
    expect(vesta.characterArrayFromString).toBeInstanceOf(Function);
  });

  test('Vesta object has clearBoardTo method', () => {
    expect(vesta.clearBoardTo).toBeInstanceOf(Function);
  });
  // test that isSpecial exists on the class
  test('Vesta object has isSpecial method', () => {
    expect(vesta.isSpecial).toBeInstanceOf(Function);
  });

  test('getSubscriptions returns an array of Subscription objects', async () => {
    const subscriptions = await vesta.getSubscriptions();
    expect(Array.isArray(subscriptions)).toBe(true);
    expect(subscriptions[0]).toHaveProperty('id');
    expect(subscriptions[0]).toHaveProperty('boardId');
    // console.log(subscriptions[0]);
    // firstSubscription = subscriptions[0].id; // Save the first subscription to the variable
  });

  // Create a test that uses the
});

// ...

describe('VestaSubscription postMessage tests', () => {
  let vesta: VestaSubscription;

  beforeAll(() => {
    vesta = createVestaboard(subscriptionConfig) as VestaSubscription;
  });

  test('clear the board and wait for rate limit', async () => {
    const subscriptions = await vesta.getSubscriptions();
    expect(Array.isArray(subscriptions)).toBe(true);
    expect(subscriptions[0]).toHaveProperty('id');
    expect(subscriptions[0]).toHaveProperty('boardId');
    const firstSubscriptionID = subscriptions[0].id;

    if (firstSubscriptionID) {
      const char =
        Object.keys(characterCode)[
          Math.floor(Math.random() * Object.keys(characterCode).length)
        ];
      const message = await vesta.clearBoardTo(char, firstSubscriptionID);

      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('characters');
      expect(message).toHaveProperty('created');
      expect(message).toHaveProperty('muted');
      await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }, 20000);

  test('post a message and wait for rate limit', async () => {
    const subscriptions = await vesta.getSubscriptions();
    expect(Array.isArray(subscriptions)).toBe(true);
    expect(subscriptions[0]).toHaveProperty('id');
    expect(subscriptions[0]).toHaveProperty('boardId');
    const firstSubscriptionID = subscriptions[0].id;

    if (firstSubscriptionID) {
      const helloWorld = `Hello World!\n${new Date().toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'long',
      })}`;

      const message = await vesta.postMessage(firstSubscriptionID, helloWorld);
      // console.log('*** Test result message ***');
      // console.log(`Message ID: ${message.id}`);
      // console.log(`Message Text: ${message.text}`);
      // console.log(`Message Created: ${message.created}`);
      // console.log(`Message Muted: ${message.muted}`);
      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('text');
      expect(message).toHaveProperty('created');
      expect(message).toHaveProperty('muted');
      // await new Promise((resolve) => setTimeout(resolve, 15000));
    }
  }, 20000);
});
