import { SyntaxKind } from '../Typings';

export default abstract class SyntaxNode {
  abstract kind: SyntaxKind;
}
