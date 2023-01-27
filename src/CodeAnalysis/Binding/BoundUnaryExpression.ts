import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import BoundUnaryOperator from './BoundUnaryOperator';
import Types from './Types';

export default class BoundUnaryExpression extends BoundExpression {
  public type: Types;
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(
    readonly operator: BoundUnaryOperator,
    readonly operand: BoundExpression
  ) {
    super();
    this.type = operand.type;
  }
}
