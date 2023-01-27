import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import StatementSyntax from './StatementSyntax';

export default class ExpressionStatementSyntax extends StatementSyntax {
  kind: SyntaxKind = SyntaxKind.EXPRESSION_STATEMENT;
  constructor(readonly expression: ExpressionSyntax) {
    super();
  }
}
