import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';

export default class BoundBinaryExpression extends BoundExpression {
  public type: any;
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(
    readonly left: BoundExpression,
    readonly operator: BoundBinaryOperator,
    readonly right: BoundExpression
  ) {
    super();
    this.type = left.type;
  }
}
