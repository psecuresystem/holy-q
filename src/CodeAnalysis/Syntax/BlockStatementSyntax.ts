import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import StatementSyntax from './StatementSyntax';
import Token from './Token';

export default class BlockStatementSyntax extends StatementSyntax {
  kind: SyntaxKind = SyntaxKind.BLOCK_EXPRESSION;
  constructor(
    readonly open_curly_brace: Token,
    readonly statements: ExpressionSyntax[],
    readonly close_curly_brace: Token
  ) {
    super();
  }
}
