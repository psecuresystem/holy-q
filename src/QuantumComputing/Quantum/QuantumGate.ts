import Matrix from '../Math/Matrix';

export default class QuantumGate {
  public matrix: Matrix;

  constructor(matrix: Matrix) {
    this.matrix = matrix;
  }
}
