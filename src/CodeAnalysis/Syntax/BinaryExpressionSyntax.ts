import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class BinaryExpressionSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.BINARY_EXPRESSION;

  constructor(
    public readonly left: ExpressionSyntax,
    public readonly operatorToken: Token,
    public readonly right: ExpressionSyntax
  ) {
    super();
  }

  *getChildren(): IterableIterator<SyntaxNode> {
    yield this.left;
    yield this.operatorToken;
    yield this.right;
  }
}
