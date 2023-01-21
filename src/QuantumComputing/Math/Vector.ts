export default class Vector {
  constructor(private items: number[]) {}

  get allItems(): number[] {
    return this.items;
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

  add(other: Vector): Vector {
    let itemIdx = 0;
    const sumArray = [];

    for (const item of other.getItems()) {
      let thisItem = this.getItem(itemIdx);
      let sum = item + thisItem;

      sumArray.push(sum);
      itemIdx++;
    }

    return new Vector(sumArray);
  }
}
