import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';

export default class BoundLiteralExpression extends BoundExpression {
  public type = 'number';
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(readonly value: any) {
    super();
  }
}
