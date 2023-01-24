import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class ReAssignmentSyntax extends ExpressionSyntax {
  constructor(
    public readonly identifierToken: Token,
    public readonly equalsToken: Token,
    public readonly expression: ExpressionSyntax
  ) {
    super();
  }

  kind: SyntaxKind = SyntaxKind.REASSIGNMENT_EXPRESSION;
  *getChildren(): IterableIterator<SyntaxNode> {
    yield this.identifierToken;
    yield this.equalsToken;
    yield this.expression;
  }
}
