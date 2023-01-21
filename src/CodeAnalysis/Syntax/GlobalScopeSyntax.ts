import { SyntaxKind } from '../Typings';
import ExpressionSyntax from './ExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import Token from './Token';

export default class GlobalScopeSyntax extends ExpressionSyntax {
  kind: SyntaxKind = SyntaxKind.GLOBAL_SCOPE_EXPRESSION;

  constructor(public readonly expressions: ExpressionSyntax[]) {
    super();
  }

  *getChildren(): IterableIterator<SyntaxNode> {
    for (const expression of this.expressions) {
      yield expression;
    }
  }
}
