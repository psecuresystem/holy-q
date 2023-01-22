import { SyntaxKind } from '../Typings';
import SyntaxNode from './SyntaxNode';

export default class Token extends SyntaxNode {
  constructor(
    readonly start: number,
    readonly value: any,
    readonly kind: SyntaxKind
  ) {
    super();
  }

  getChildren(): IterableIterator<SyntaxNode> {
    return (function* () {})();
  }
}
