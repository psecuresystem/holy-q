import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';

export default class BoundVariableExpression extends BoundExpression {
  kind: BoundNodeKind = BoundNodeKind.VariableExpression;
  constructor(readonly name: string, readonly type: any) {
    super();
  }
}
