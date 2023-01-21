import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class ParenthesizedExpressionSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.PARENTHESIZED_EXPRESSION;

  constructor(
    private readonly openParenthesisToken: Token,
    public readonly expression: ExpressionSyntax,
    private readonly closeParenthesisToken: Token
  ) {
    super();
  }

  *getChildren(): IterableIterator<SyntaxNode> {
    yield this.openParenthesisToken;
    yield this.expression;
    yield this.closeParenthesisToken;
  }
}
