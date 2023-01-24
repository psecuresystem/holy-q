import VariableSymbol from '../VariableSymbol';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';

export default class BoundAssignmentExpression extends BoundExpression {
  public type: any;
  kind: BoundNodeKind = BoundNodeKind.AssignmentExpression;
  constructor(
    readonly variable: VariableSymbol,
    readonly value: BoundExpression
  ) {
    super();
    this.type = value.type;
  }
}
