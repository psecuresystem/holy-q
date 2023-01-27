import BoundNodeKind from './BoundNodeKind';
import BoundStatement from './BoundStatement';
import Types from './Types';

export default class BoundGlobalScopeExpression {
  public type: Types;
  kind: BoundNodeKind = BoundNodeKind.GlobalScopeExpression;
  constructor(readonly expressions: BoundStatement[]) {
    this.type = Types.Scope;
  }
}
