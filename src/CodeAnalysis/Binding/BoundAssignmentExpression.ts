import VariableSymbol from '../Symbols/VariableSymbol';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import Types from './Types';

export default class BoundAssignmentExpression extends BoundExpression {
  public type: Types;
  kind: BoundNodeKind = BoundNodeKind.AssignmentExpression;
  constructor(
    readonly variable: VariableSymbol,
    readonly value: BoundExpression
  ) {
    super();
    this.type = value.type;
  }
}
