import Scalar from './Scalar';

type productTypes = 'dot' | 'tensor' | 'normal';
export default class Vector<T extends number | Scalar = number> {
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

  add(other: Vector<any>): Vector<any> {
    let itemIdx = 0;
    const sumArray = [];
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
      if (typeof item == 'number' && typeof thisItem == 'number') {
        sum = item + thisItem;
      } else if (thisItem instanceof Scalar && item instanceof Scalar) {
        sum = thisItem.add(item);
      } else {
        throw new Error('Unsupported Vector Type');
      }

      sumArray.push(sum);
      itemIdx++;
    }

    return new Vector(sumArray);
  }

  sub(other: Vector<any>): Vector<any> {
    let itemIdx = 0;
    const diffArray = [];
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
      if (typeof item == 'number' && typeof thisItem == 'number') {
        diff = item - thisItem;
      } else if (thisItem instanceof Scalar && item instanceof Scalar) {
        diff = thisItem.sub(item);
      } else {
        throw new Error('Unsupported Vector Type');
      }

      diffArray.push(diff);
      itemIdx++;
    }

    return new Vector(diffArray);
  }

  getZero(): T {
    if (typeof this.allItems?.[0] == 'number') return 0 as T;
    return Scalar.fromEmpty() as T;
  }

  multiply(other: Vector, type: productTypes = 'normal'): Vector | Scalar | T {
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

  divide(other: Vector<any>): Vector<any> {
    let product = [];
    let itemIdx = 0;
    for (const thisItem of this.getItems()) {
      if (
        thisItem instanceof Scalar &&
        other.items[itemIdx] instanceof Scalar
      ) {
        product.push(thisItem.multiply(other.items[itemIdx]));
      } else if (
        typeof thisItem == 'number' ||
        typeof other.items[itemIdx] == 'number'
      ) {
        product.push(+thisItem / other.items[itemIdx]);
      } else {
        throw new Error('Vector Type Mismatch');
      }

      itemIdx++;
    }
    return new Vector(product);
  }

  private dotProduct(other: Vector<any>): T {
    let sum;
    let itemIdx = 0;
    if (
      typeof this.getItem(itemIdx) === 'number' &&
      typeof this.getItem(0) === 'number'
    ) {
      sum = 0;
    } else if (
      this.getItem(itemIdx) instanceof Scalar &&
      this.getItem(0) instanceof Scalar
    ) {
      sum = Scalar.fromEmpty();
    } else {
      throw new Error('Invalid Number Type');
    }
    for (const otherItem of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      if (typeof sum == 'number') {
        sum += otherItem * +thisItem;
      } else {
        sum = sum.add((otherItem as Scalar).multiply(thisItem as Scalar));
      }
      itemIdx++;
    }
    return sum as T;
  }

  private tensorProduct(other: Vector<any>): Vector<any> {
    let product = [];
    for (const thisItem of this.getItems()) {
      for (const otherItem of other.getItems()) {
        let value;
        if (typeof otherItem == 'number' && typeof thisItem == 'number') {
          value = otherItem * thisItem;
        } else if (thisItem instanceof Scalar && otherItem instanceof Scalar) {
          value = thisItem.multiply(otherItem);
        } else {
          throw new Error('Unsupported Vector Type');
        }
        product.push(value);
      }
    }
    return new Vector(product);
  }

  private normalProduct(other: Vector<any>): Vector<any> {
    let product = [];
    let itemIdx = 0;
    for (const thisItem of this.getItems()) {
      let value;
      if (
        typeof other.items[itemIdx] == 'number' &&
        typeof thisItem == 'number'
      ) {
        value = other.items[itemIdx] * thisItem;
      } else if (
        thisItem instanceof Scalar &&
        other.items[itemIdx] instanceof Scalar
      ) {
        value = thisItem.multiply(other.items[itemIdx]);
      } else {
        throw new Error('Unsupported Vector Type');
      }
      product.push(value);
      itemIdx++;
    }
    return new Vector(product);
  }
}
