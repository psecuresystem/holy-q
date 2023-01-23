import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class NameExpressionSyntax extends ExpressionSyntax {
  constructor(readonly identifierToken: Token) {
    super();
  }

  kind: SyntaxKind = SyntaxKind.NAME_EXPRESSION_SYNTAX;
  getChildren(): IterableIterator<SyntaxNode> {
    throw new Error('Method not implemented.');
  }
}
