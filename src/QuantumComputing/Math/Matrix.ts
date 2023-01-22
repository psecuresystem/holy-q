import Vector from './Vector';

export default class Matrix {
  constructor(
    private readonly rows: number[][],
    public readonly size: [number, number]
  ) {
    if (this.rows.length !== size[0] || this.rows?.[0].length !== size[1]) {
      console.log('this.rows', this.rows);
      console.log('this.size', this.size);
      throw new Error(`
Invalid Matrix Size. 
    Expected ${size[0]}x${size[1]},
    Got ${this.rows.length || 0}x${this.rows?.[0].length || 0}
`);
    }
  }

  get allRows() {
    return this.rows;
  }

  static fromVector(
    vector: Vector,
    orientation: 'vertical' | 'horizontal'
  ): Matrix {
    if (orientation == 'horizontal') {
      return new Matrix([vector.allItems], [1, vector.size]);
    } else {
      return new Matrix(
        vector.allItems.map((item) => [item]),
        [vector.size, 1]
      );
    }
  }

  getItem(row: number, column: number): number {
    if (row >= this.size[0]) throw new Error(`Row doesn't exist`);
    if (column >= this.size[1]) throw new Error(`Column doesn't exist`);
    return this.rows[row][column];
  }

  setItem(row: number, column: number, value: number) {
    if (row >= this.size[0]) throw new Error(`Row doesn't exist`);
    if (column >= this.size[1]) throw new Error(`Column doesn't exist`);
    this.rows[row][column] = value;
    return;
  }

  *getRows(): IterableIterator<number[]> {
    for (const row of this.rows) {
      yield row;
    }
  }

  *getColumns(): IterableIterator<number[]> {
    for (let columnIdx = 0; columnIdx < this.rows?.[0].length; columnIdx++) {
      const column = [];
      for (let rowIdx = 0; rowIdx < this.rows.length; rowIdx++) {
        column.push(this.rows[rowIdx][columnIdx]);
      }
      yield column;
    }
  }

  getRow(row: number): number[] {
    if (row >= this.size[0]) throw new Error(`Row doesn't exist`);
    return this.rows[row];
  }

  add(other: Matrix): Matrix {
    const sum = [];
    let rowId = 0;
    for (const row of other.getRows()) {
      let thisRowVector = new Vector(this.getRow(rowId));
      let rowVector = new Vector(row);
      sum.push(rowVector.add(thisRowVector).allItems);
      rowId++;
    }
    return new Matrix(sum, this.size);
  }

  sub(other: Matrix): Matrix {
    const sum = [];
    let rowId = 0;
    for (const row of other.getRows()) {
      let thisRowVector = new Vector(this.getRow(rowId));
      let rowVector = new Vector(row);
      sum.push(rowVector.sub(thisRowVector).allItems);
      rowId++;
    }
    return new Matrix(sum, this.size);
  }

  multiply(other: Matrix): Matrix {
    if (other.size[0] !== this.size[1]) throw new Error(`Size Mismatch`);
    const product: number[][] = [];
    let rowIdx = 0;
    for (const row of this.getRows()) {
      product.push([]);
      for (const column of other.getColumns()) {
        const rowVector = new Vector(row);
        const columnVector = new Vector(column);
        const multiplicationResult = rowVector.multiply(columnVector, 'dot');
        product[rowIdx].push(+multiplicationResult);
      }
      rowIdx++;
    }
    return new Matrix(product, [this.size[0], other.size[1]]);
  }

  flatten(): Vector {
    let finalData = [];
    for (const row of this.getRows()) {
      finalData.push(...row);
    }
    return new Vector(finalData);
  }

  static transpose(matrix: Matrix) {
    const newMatrix = new Array(matrix.size[0]).fill(
      new Array(matrix.size[1]).fill(0)
    );
    let rowIdx = 0;
    for (const row of matrix.getRows()) {
      for (let colIdx = 0; colIdx < matrix.size[1]; colIdx++) {
        newMatrix[colIdx][rowIdx] = row[colIdx];
      }
      rowIdx++;
    }
    return new Matrix(newMatrix, [matrix.size[1], matrix.size[0]]);
  }
}
