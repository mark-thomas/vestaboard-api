import VestaSubscription from './VestaSubscription';
import VestaRW from './rwAPI';
import VestaLocal from './localAPI';
import { APIConfig, VestaboardControlMode } from './types';
export declare function createVestaboard(mode: VestaboardControlMode, config: APIConfig): VestaSubscription | VestaRW | VestaLocal;
export { VestaSubscription, VestaRW, VestaLocal, VestaboardControlMode };
