import VestaSubscription from './VestaSubscription';
import VestaRW from './rwAPI';
import VestaLocal from './localAPI';
import { APIConfig, VestaboardControlMode } from './types';

export function createVestaboard(
  config: APIConfig
): VestaSubscription | VestaRW | VestaLocal {
  switch (config.mode) {
    case VestaboardControlMode.Subscription:
      return new VestaSubscription(config);
    case VestaboardControlMode.RW:
      return new VestaRW(config);
    case VestaboardControlMode.Local:
      return new VestaLocal(config);
    default:
      throw new Error('Invalid Vestaboard mode');
  }
}

export { VestaSubscription, VestaRW, VestaLocal };
