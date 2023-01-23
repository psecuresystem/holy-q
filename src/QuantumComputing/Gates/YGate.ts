import ComplexNumber from '../../Math/ComplexNumber';
import Matrix from '../../Math/Matrix';
import RealNumber from '../../Math/RealNumber';
import Vector from '../../Math/Vector';
import QuantumGate from './QuantumGate';

export default class YGate extends QuantumGate {
  constructor() {
    let matrix = new Matrix(
      [
        [
          ComplexNumber.fromInt(new RealNumber(0)),
          new ComplexNumber(
            new Vector([
              RealNumber.fromEmpty(),
              new RealNumber(-1),
              RealNumber.fromEmpty(),
              RealNumber.fromEmpty(),
            ])
          ),
        ],
        [
          new ComplexNumber(
            new Vector([
              RealNumber.fromEmpty(),
              new RealNumber(-1),
              RealNumber.fromEmpty(),
              RealNumber.fromEmpty(),
            ])
          ),
          ComplexNumber.fromInt(new RealNumber(0)),
        ],
      ],
      [2, 2]
    );
    super(matrix);
  }
}
