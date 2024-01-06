import VestaSubscription from './VestaSubscription';
import VestaRW from './rwAPI';
import VestaLocal from './localAPI';
import { APIConfig, LocalAPIConfig, RWAPIConfig, SubscriptionAPIConfig, VestaboardControlMode, BoardCharArray, Line } from './types';
import { characterCode, characterCodeArray } from './values';
export declare function createVestaboard(mode: VestaboardControlMode, config: APIConfig): VestaSubscription | VestaRW | VestaLocal;
export { VestaSubscription, VestaRW, VestaLocal, VestaboardControlMode, characterCode, characterCodeArray, BoardCharArray, Line, APIConfig, SubscriptionAPIConfig, RWAPIConfig, LocalAPIConfig, };
