import { SyntaxKind } from '../Typings';
import BlockStatementSyntax from './BlockStatementSyntax';
import ExpressionSyntax from './ExpressionSyntax';
import StatementSyntax from './StatementSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class IfExpressionSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.IF_STATEMENT_EXPRESSION;
  constructor(
    readonly ifToken: Token,
    readonly open_parenthesis: Token,
    readonly condition: StatementSyntax,
    readonly statements: BlockStatementSyntax,
    readonly close_parenthesis: Token
  ) {
    super();
  }
}
