import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SeperatedSyntaxList from './SeperatedSyntaxList';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class CallExpressionSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.CALL_EXPRESSION;

  constructor(
    public readonly identifier: Token,
    public readonly openParenthesisToken: Token,
    public readonly functionArguments: SeperatedSyntaxList<ExpressionSyntax>,
    public readonly closeParenthesisToken: Token
  ) {
    super();
  }

  *getChildren(): IterableIterator<SyntaxNode> {
    yield this.identifier;
    yield this.openParenthesisToken;
    for (const argument of this.functionArguments.getNodes()) {
      yield argument;
    }
    yield this.closeParenthesisToken;
  }
}
