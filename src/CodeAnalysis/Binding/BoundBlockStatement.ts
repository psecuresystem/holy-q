import BoundExpression from './BoundExpression';
import BoundNodeKind from './BoundNodeKind';
import BoundStatement from './BoundStatement';
import Types from './Types';

export default class BoundBlockStatement extends BoundStatement {
  public kind: BoundNodeKind;

  constructor(readonly statements: BoundStatement[]) {
    super();
    this.kind = BoundNodeKind.BlockStatement;
  }
}
