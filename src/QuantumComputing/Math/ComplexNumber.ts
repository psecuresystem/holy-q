import { primes } from '../../constants';
import Matrix from './Matrix';
import Number from './Number';
import RealNumber from './RealNumber';
import Vector from './Vector';

const _labels = ['', 'i', 'j', 'k', 'ij', 'ik', 'jk'];

export default class ComplexNumber extends Number {
  constructor(public readonly value: Vector<RealNumber>) {
    super();
    if (value.size < 4) this.value.fill(RealNumber.fromEmpty(), 4 - value.size);
  }

  static fromInt(num: RealNumber): ComplexNumber {
    return new ComplexNumber(new Vector([num, RealNumber.fromEmpty()]));
  }

  static fromEmpty(): ComplexNumber {
    return new ComplexNumber(
      new Vector([
        RealNumber.fromEmpty(),
        RealNumber.fromEmpty(),
        RealNumber.fromEmpty(),
        RealNumber.fromEmpty(),
      ])
    );
  }

  toString() {
    let finalString = '';
    let isFirst = true;
    let depth = 0;
    for (const number of this.value.getItems()) {
      if (!number.computedValue) {
        depth++;
        continue;
      }
      finalString += isFirst ? number : ` + ${number}${_labels[depth]}`;
      if (isFirst) isFirst = false;
      depth++;
    }
    return finalString;
  }

  add(other: ComplexNumber) {
    return new ComplexNumber(this.value.add(other.value));
  }

  subtract(other: ComplexNumber) {
    return new ComplexNumber(this.value.sub(other.value));
  }

  multiply(other: ComplexNumber): ComplexNumber {
    const product = Matrix.fromVector(this.value, 'vertical').multiply(
      Matrix.fromVector(other.value, 'horizontal')
    );
    const operatorVector = new Vector(
      primes.slice(0, Math.min(...product.size))
    );
    const operatorMatrix = Matrix.fromVector(
      operatorVector,
      'vertical'
    ).multiply(Matrix.fromVector(operatorVector, 'horizontal'));

    return new ComplexNumber(
      this.trimMatrixByEqualIndices(
        product,
        this.getEqualIndexes(operatorMatrix)
      ) as Vector<RealNumber>
    );
  }

  private getEqualIndexes(matrix: Matrix) {
    let equal: Record<number, number[][]> = {};
    let rowIdx = 0;
    for (const row of matrix.getRows()) {
      let colIdx = 0;
      for (const col of row) {
        if (rowIdx !== colIdx || (rowIdx == 0 && colIdx == 0)) {
          if (!equal[`${col}` as any]) {
            equal[`${col}` as any] = [[rowIdx, colIdx]];
          } else {
            equal[`${col}` as any].push([rowIdx, colIdx]);
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
  ): Vector<Number> {
    let final: Number[] = [];
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
            let finalValue = Number.fromEmpty();
            for (const index of sumArray) {
              finalValue = finalValue.add(matrix.getItem(index[0], index[1]));
              visited.add(`${index[0]}:${index[1]}`);
            }
            final.push(finalValue);
          } else {
            final[0] = final[0].subtract(col);
          }
        }
        colIdx++;
      }
      rowIdx++;
    }
    if (final.slice(4).reduce((acc, val) => acc.add(val)) == new RealNumber(0))
      final = final.slice(0, 4);
    return new Vector(final);
  }

  divide(other: ComplexNumber) {
    return new ComplexNumber(
      this.value.divide(other.value) as Vector<RealNumber>
    );
  }
}
