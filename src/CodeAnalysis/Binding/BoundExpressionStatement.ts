import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import BoundStatement from './BoundStatement';

export default class BoundExpressionStatement extends BoundStatement {
  public kind: BoundNodeKind = BoundNodeKind.ExpressionStatement;
  constructor(readonly expression: BoundExpression) {
    super();
  }
}
