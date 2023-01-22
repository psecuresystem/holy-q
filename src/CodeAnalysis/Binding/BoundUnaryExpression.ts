import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import BoundUnaryOperator from './BoundUnaryOperator';

export default class BoundUnaryExpression extends BoundExpression {
  public type: any;
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(
    readonly operator: BoundUnaryOperator,
    readonly operand: BoundExpression
  ) {
    super();
    this.type = operand.type;
  }
}
