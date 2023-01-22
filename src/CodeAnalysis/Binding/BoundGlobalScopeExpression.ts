import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';

export default class BoundGlobalScopeExpression extends BoundExpression {
  public type: any;
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(readonly expressions: BoundExpression[]) {
    super();
    this.type = 'scope';
  }
}
