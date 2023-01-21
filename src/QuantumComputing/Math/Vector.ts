type productTypes = 'dot' | 'tensor';
export default class Vector {
  constructor(private readonly items: number[]) {}

  get allItems(): number[] {
    return this.items;
  }

  get size(): number {
    return this.items.length;
  }

  push(item: number) {
    this.items.push(item);
    return this.items;
  }

  pull(idx: number) {
    if (this.items.length <= idx) {
      throw new Error('Index is greater than vector size');
    }
    return this.items.splice(idx, 1);
  }

  getItem(idx: number): number {
    return this.items[idx];
  }

  *getItems(): IterableIterator<number> {
    for (const item of this.items) {
      yield item;
    }
  }

  magnitude(): number {
    const sum = this.items.reduce((acc, item) => acc + item);
    return Math.sqrt(sum);
  }

  add(other: Vector): Vector {
    let itemIdx = 0;
    const sumArray = [];
    if (other.allItems.length !== this.items.length)
      throw new Error('Two Vector Lengths are not equal');

    for (const item of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      let sum = item + thisItem;

      sumArray.push(sum);
      itemIdx++;
    }

    return new Vector(sumArray);
  }

  sub(other: Vector): Vector {
    let itemIdx = 0;
    const sumArray = [];
    if (other.allItems.length !== this.items.length)
      throw new Error('Two Vector Lengths are not equal');

    for (const item of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      let sum = item - thisItem;

      sumArray.push(sum);
      itemIdx++;
    }

    return new Vector(sumArray);
  }

  multiply(other: Vector, type: productTypes = 'tensor'): Vector | number {
    if (other.allItems.length !== this.items.length)
      throw new Error('Two Vector Lengths are not equal');
    if (type == 'tensor') return this.tensorProduct(other);
    return this.dotProduct(other);
  }

  angleBetween(other: Vector): number {
    if (other.allItems.length !== this.items.length)
      throw new Error('Two Vector Lengths are not equal');
    let dotProduct = this.dotProduct(other);
    let magnitudeProduct = this.magnitude() * other.magnitude();
    return +(dotProduct / magnitudeProduct).toFixed(4);
  }

  private dotProduct(other: Vector): number {
    let sum = 0;
    let itemIdx = 0;
    for (const otherItem of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      sum += otherItem * thisItem;
      itemIdx++;
    }
    return sum;
  }

  private tensorProduct(other: Vector): Vector {
    let product = [];
    for (const thisItem of this.getItems()) {
      for (const otherItem of other.getItems()) {
        product.push(thisItem * otherItem);
      }
    }
    return new Vector(product);
  }
}
