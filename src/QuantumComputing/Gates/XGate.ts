import ComplexNumber from '../../Math/ComplexNumber';
import Matrix from '../../Math/Matrix';
import RealNumber from '../../Math/RealNumber';
import QuantumGate from './QuantumGate';

export default class XGate extends QuantumGate {
  constructor() {
    let matrix = new Matrix(
      [
        [
          ComplexNumber.fromInt(new RealNumber(0)),
          ComplexNumber.fromInt(new RealNumber(1)),
        ],
        [
          ComplexNumber.fromInt(new RealNumber(1)),
          ComplexNumber.fromInt(new RealNumber(0)),
        ],
      ],
      [2, 2]
    );
    super(matrix);
  }
}
