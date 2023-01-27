import VariableSymbol from '../Symbols/VariableSymbol';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import Types from './Types';

export default class BoundVariableExpression extends BoundExpression {
  kind: BoundNodeKind = BoundNodeKind.VariableExpression;
  constructor(readonly variable: VariableSymbol, readonly type: Types) {
    super();
  }
}
