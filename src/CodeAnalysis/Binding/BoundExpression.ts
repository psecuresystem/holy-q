import BoundNode from './BoundNode';

export default abstract class BoundExpression extends BoundNode {
  public abstract type: any;
}
