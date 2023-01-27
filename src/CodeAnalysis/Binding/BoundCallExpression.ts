import FunctionSymbol from '../Symbols/FunctionSymbol';
import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import BoundStatement from './BoundStatement';
import Types from './Types';

export default class BoundCallExpression extends BoundStatement {
  public type: Types;
  public kind: BoundNodeKind;

  constructor(
    readonly func: FunctionSymbol,
    readonly functionArguments: BoundExpression[]
  ) {
    super();
    this.type = func.type;
    this.kind = BoundNodeKind.CallExpression;
  }
}
