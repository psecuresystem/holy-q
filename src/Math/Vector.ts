import ComplexNumber from './ComplexNumber';
import Number from './Number';
import RealNumber from './RealNumber';

type productTypes = 'dot' | 'tensor' | 'normal';
export default class Vector<T extends Number = RealNumber> {
  constructor(private readonly items: T[]) {}

  get allItems(): T[] {
    return this.items;
  }

  get size(): number {
    return this.items.length;
  }

  fill(item: T, till: number = 1): T[] {
    this.items.push(...(new Array(till).fill(item) as T[]));
    return this.items;
  }

  push(...items: T[]) {
    this.items.push(...items);
    return this.items;
  }

  pull(idx: number) {
    if (this.items.length <= idx) {
      throw new Error('Index is greater than vector size');
    }
    return this.items.splice(idx, 1);
  }

  getItem(idx: number): T {
    return this.items[idx];
  }

  *getItems(): IterableIterator<T> {
    for (const item of this.items) {
      yield item;
    }
  }

  add(other: Vector<T>): Vector<T> {
    let itemIdx = 0;
    const sumArray: T[] = [];
    if (other.allItems.length !== this.items.length) {
      if (other.allItems.length > this.allItems.length) {
        this.fill(this.getZero(), other.allItems.length - this.allItems.length);
      } else {
        other.fill(
          other.getZero(),
          this.allItems.length - other.allItems.length
        );
      }
    }
    let thisItem = this.getItem(itemIdx);
    let otherItem = other.getItem(itemIdx);
    if (typeof otherItem != typeof thisItem)
      throw new Error('Vector Type Mismatch');

    for (const item of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      let sum;
      sum = thisItem.add(item);

      sumArray.push(sum as T);
      itemIdx++;
    }

    return new Vector(sumArray);
  }

  sub(other: Vector<T>): Vector<T> {
    let itemIdx = 0;
    const diffArray: T[] = [];
    if (other.allItems.length !== this.items.length) {
      if (other.allItems.length > this.allItems.length) {
        this.fill(this.getZero(), other.allItems.length - this.allItems.length);
      } else {
        other.fill(
          other.getZero(),
          this.allItems.length - other.allItems.length
        );
      }
    }
    let thisItem = this.getItem(itemIdx);
    let otherItem = other.getItem(itemIdx);
    if (typeof otherItem != typeof thisItem)
      throw new Error('Vector Type Mismatch');

    for (const item of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      let diff;
      diff = item.subtract(thisItem);

      diffArray.push(diff as T);
      itemIdx++;
    }

    return new Vector(diffArray);
  }

  getZero(): T {
    if (this.items?.[0] instanceof ComplexNumber) {
      return ComplexNumber.fromEmpty() as unknown as T;
    }
    return Number.fromEmpty() as T;
  }

  multiply(
    other: Vector<Number>,
    type: productTypes = 'normal'
  ): Vector<Number> | Number {
    if (other.allItems.length !== this.items.length) {
      if (other.allItems.length > this.allItems.length) {
        this.fill(this.getZero(), other.allItems.length - this.allItems.length);
      } else {
        other.fill(
          other.getZero(),
          this.allItems.length - other.allItems.length
        );
      }
    }
    if (typeof other.getItem(0) != typeof this.getItem(0))
      throw new Error('Vector Type Mismatch');
    if (type == 'tensor') return this.tensorProduct(other);
    if (type == 'normal') return this.normalProduct(other);
    return this.dotProduct(other);
  }

  divide(other: Vector<Number>): Vector<Number> {
    let product = [];
    let itemIdx = 0;
    for (const thisItem of this.getItems()) {
      product.push(thisItem.multiply(other.items[itemIdx]));
      itemIdx++;
    }
    return new Vector(product);
  }

  private dotProduct(other: Vector<Number>): Number {
    let sum;
    let itemIdx = 0;

    sum = Number.fromEmpty();

    for (const otherItem of other.getItems()) {
      let thisItem = this.getItem(itemIdx);

      sum = sum.add(otherItem.multiply(thisItem));
      itemIdx++;
    }
    return sum as Number;
  }

  private tensorProduct(other: Vector<Number>): Vector<Number> {
    let product = [];
    for (const thisItem of this.getItems()) {
      for (const otherItem of other.getItems()) {
        let value;
        value = thisItem.multiply(otherItem);
        product.push(value);
      }
    }
    return new Vector(product);
  }

  private normalProduct(other: Vector<Number>): Vector<Number> {
    let product = [];
    let itemIdx = 0;
    for (const thisItem of this.getItems()) {
      let value;
      value = thisItem.multiply(other.items[itemIdx]);
      product.push(value);
      itemIdx++;
    }
    return new Vector(product);
  }
}
