import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import Types from './Types';

export default class BoundBinaryExpression extends BoundExpression {
  public type: Types;
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(
    readonly left: BoundExpression,
    readonly operator: BoundBinaryOperator,
    readonly right: BoundExpression
  ) {
    super();
    this.type = operator.resultType;
  }
}
