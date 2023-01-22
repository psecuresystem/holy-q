import { SyntaxKind } from '../Typings';

export default abstract class SyntaxNode {
  abstract kind: SyntaxKind;

  abstract getChildren(): IterableIterator<SyntaxNode>;
}
