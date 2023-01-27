import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import Types from './Types';

export default class BoundLiteralExpression extends BoundExpression {
  public type: Types = Types.Number;
  kind: BoundNodeKind = BoundNodeKind.LiteralExpression;
  constructor(readonly value: any) {
    super();
  }
}
