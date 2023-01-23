import ComplexNumber from '../Math/ComplexNumber';
import Matrix from '../Math/Matrix';
import Number from '../Math/Number';
import RealNumber from '../Math/RealNumber';
import Vector from '../Math/Vector';
import QuantumGate from './Gates/QuantumGate';

export default class Qubit {
  constructor(public readonly state: Vector<Number>) {
    if (state.size !== 2) throw new Error('Qubit Vector Size has to be 2');
  }

  static fromBit(state: 0 | 1) {
    if (state)
      return new Qubit(
        new Vector([
          ComplexNumber.fromInt(new RealNumber(0)),
          ComplexNumber.fromInt(new RealNumber(1)),
        ])
      );
    return new Qubit(
      new Vector([
        ComplexNumber.fromInt(new RealNumber(1)),
        ComplexNumber.fromInt(new RealNumber(0)),
      ])
    );
  }

  apply(gate: QuantumGate): Qubit {
    const result = gate.matrix.multiply(
      Matrix.fromVector(this.state, 'vertical')
    );
    return new Qubit(result.flatten());
  }
}
