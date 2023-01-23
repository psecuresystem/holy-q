import BoundNode from './BoundNode';
import Types from './Types';

export default abstract class BoundExpression extends BoundNode {
  public abstract type: Types;
}
