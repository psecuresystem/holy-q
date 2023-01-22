import { primes } from '../../constants';
import Matrix from './Matrix';
import Vector from './Vector';

const _labels = ['', 'i', 'j', 'k', 'ij', 'ik', 'jk'];

export default class Scalar {
  constructor(public readonly value: Vector) {
    if (value.size < 4) this.value.fill(0, 4 - value.size);
  }

  static fromInt(num: number): Scalar {
    return new Scalar(new Vector([num, 0]));
  }

  static fromEmpty(): Scalar {
    return new Scalar(new Vector([0, 0, 0, 0]));
  }

  toString() {
    let finalString = '';
    let isFirst = true;
    let depth = 0;
    for (const number of this.value.getItems()) {
      if (!number) {
        depth++;
        continue;
      }
      finalString += isFirst ? number : `+ ${number}${_labels[depth]}`;
      if (isFirst) isFirst = false;
      depth++;
    }
    return finalString;
  }

  add(other: Scalar) {
    return new Scalar(this.value.add(other.value));
  }

  sub(other: Scalar) {
    return new Scalar(this.value.sub(other.value));
  }

  multiply(other: Scalar): Scalar {
    const product = Matrix.fromVector(this.value, 'vertical').multiply(
      Matrix.fromVector(other.value, 'horizontal')
    );
    const operatorVector = new Vector(primes.slice(0, product.size[0]));
    const operatorMatrix = Matrix.fromVector(
      operatorVector,
      'vertical'
    ).multiply(Matrix.fromVector(operatorVector, 'horizontal'));

    return new Scalar(
      this.trimMatrixByEqualIndices(
        product,
        this.getEqualIndexes(operatorMatrix)
      )
    );
  }

  private getEqualIndexes(matrix: Matrix) {
    let equal: Record<number, number[][]> = {};
    let rowIdx = 0;
    for (const row of matrix.getRows()) {
      let colIdx = 0;
      for (const col of row) {
        if (rowIdx !== colIdx || (rowIdx == 0 && colIdx == 0)) {
          if (!equal[col]) {
            equal[col] = [[rowIdx, colIdx]];
          } else {
            equal[col].push([rowIdx, colIdx]);
          }
        }
        colIdx++;
      }
      rowIdx++;
    }
    return Object.values(equal);
  }

  private trimMatrixByEqualIndices(
    matrix: Matrix,
    indices: number[][][]
  ): Vector {
    let final = [];
    let visited = new Set();
    let rowIdx = 0;
    for (const row of matrix.getRows()) {
      let colIdx = 0;
      for (const col of row) {
        if (!visited.has(`${rowIdx}:${colIdx}`)) {
          let sumArray = indices.find((index) =>
            index.some((el) => el[0] == rowIdx && el[1] == colIdx)
          );
          if (sumArray) {
            let finalValue = 0;
            for (const index of sumArray) {
              finalValue += matrix.getItem(index[0], index[1]);
              visited.add(`${index[0]}:${index[1]}`);
            }
            final.push(finalValue);
          } else {
            final[0] -= col;
          }
        }
        colIdx++;
      }
      rowIdx++;
    }
    if (final.slice(4).reduce((acc, val) => acc + val) == 0)
      final = final.slice(0, 4);
    return new Vector(final);
  }

  divide(other: Scalar) {
    return new Scalar(this.value.divide(other.value));
  }
}
