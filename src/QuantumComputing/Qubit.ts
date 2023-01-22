import RealNumber from './Math/RealNumber';
import Vector from './Math/Vector';

export default class Qubit {
  constructor(public readonly state: Vector) {}

  static fromBit(state: 0 | 1) {
    if (state)
      return new Qubit(new Vector([new RealNumber(0), new RealNumber(1)]));
    return new Qubit(new Vector([new RealNumber(1), new RealNumber(0)]));
  }
}
