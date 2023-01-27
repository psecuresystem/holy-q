import SyntaxNode from './SyntaxNode';

export default class SeperatedSyntaxList<T extends SyntaxNode> {
  constructor(readonly _nodesAndSeparators: T[]) {}

  get count(): number {
    return (this._nodesAndSeparators.length + 1) / 2;
  }

  *getNodes(): IterableIterator<T> {
    let counter = 0;
    for (const el of this._nodesAndSeparators) {
      if (counter % 2 === 0) {
        yield el;
      }
      counter++;
    }
  }
}
