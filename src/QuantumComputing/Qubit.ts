import Vector from './Math/Vector';

export default class Qubit {
  constructor(public readonly state: Vector) {}

  static fromBit(state: 0 | 1) {
    if (state) return new Qubit(new Vector([0, 1]));
    return new Qubit(new Vector([1, 0]));
  }
}
