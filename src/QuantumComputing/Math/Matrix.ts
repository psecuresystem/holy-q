import Vector from './Vector';

export default class Matrix {
  constructor(
    private readonly rows: number[][],
    private readonly size: number
  ) {
    if (this.rows.length !== size || this.rows?.[0].length !== size) {
      throw new Error(`
Invalid Matrix Size. 
    Expected ${size}x${size},
    Got ${this.rows.length || 0}x${this.rows?.[0].length || 0}
`);
    }
  }

  getItem(row: number, column: number): number {
    if (row >= this.size) throw new Error(`Row doesn't exist`);
    if (column >= this.size) throw new Error(`Column doesn't exist`);
    return this.rows[row][column];
  }

  *getRows(): IterableIterator<number[]> {
    for (const row of this.rows) {
      yield row;
    }
  }

  getRow(row: number): number[] {
    if (row >= this.size) throw new Error(`Row doesn't exist`);
    return this.rows[row];
  }

  add(to: Matrix): Matrix {
    const sum = [];
    let rowId = 0;
    for (const row of to.getRows()) {
      let thisRowVector = new Vector(this.getRow(rowId));
      let rowVector = new Vector(row);
      sum.push(rowVector.add(thisRowVector).allItems);
    }
    return new Matrix(sum, this.size);
  }
}
