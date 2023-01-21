import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class UnaryExpressionSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.UNARY_EXPRESSION;

  constructor(
    public readonly operator: Token,
    public readonly operand: ExpressionSyntax
  ) {
    super();
  }

  *getChildren(): IterableIterator<SyntaxNode> {
    yield this.operator;
    yield this.operand;
  }
}
