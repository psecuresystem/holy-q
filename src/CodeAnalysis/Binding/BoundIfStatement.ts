import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import BoundStatement from './BoundStatement';

export default class BoundIfStatement extends BoundStatement {
  public kind: BoundNodeKind = BoundNodeKind.IfStatement;
  constructor(
    readonly condition: BoundExpression,
    readonly block: BoundStatement
  ) {
    super();
  }
}
