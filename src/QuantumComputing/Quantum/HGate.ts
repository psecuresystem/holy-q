import ComplexNumber from '../Math/ComplexNumber';
import Matrix from '../Math/Matrix';
import RealNumber from '../Math/RealNumber';
import Vector from '../Math/Vector';
import QuantumGate from './QuantumGate';

export default class HGate extends QuantumGate {
  constructor() {
    let matrix = new Matrix(
      [
        [
          ComplexNumber.fromInt(new RealNumber(1)),
          ComplexNumber.fromInt(new RealNumber(1)),
        ],
        [
          ComplexNumber.fromInt(new RealNumber(1)),
          ComplexNumber.fromInt(new RealNumber(1)),
        ],
      ],
      [2, 2]
    ).scalarMultiply(ComplexNumber.fromInt(new RealNumber(1, Math.sqrt(2))));
    super(matrix);
  }
}
