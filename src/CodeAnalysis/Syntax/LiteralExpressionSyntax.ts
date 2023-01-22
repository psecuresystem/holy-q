import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class LiteralExpressionSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.LITERAL_EXPRESSION;
  value: any;

  constructor(private readonly numberToken: Token, value?: any) {
    super();
    this.value = value ? value : numberToken.value;
  }

  *getChildren(): IterableIterator<SyntaxNode> {
    return yield this.numberToken;
  }
}
