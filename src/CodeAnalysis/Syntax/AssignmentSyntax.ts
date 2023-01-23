import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class AssignmentSyntax extends ExpressionSyntax {
  constructor(
    public readonly variableSymbol: Token,
    public readonly identifierToken: Token,
    public readonly mutable: boolean,
    public readonly equalsToken: Token,
    public readonly expression: ExpressionSyntax
  ) {
    super();
  }

  kind: SyntaxKind = SyntaxKind.ASSIGNMENT_EXPRESSION;
  *getChildren(): IterableIterator<SyntaxNode> {
    yield this.variableSymbol;
    yield this.identifierToken;
    yield this.equalsToken;
    yield this.expression;
  }
}
