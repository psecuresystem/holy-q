import BoundBinaryExpression from './Binding/BoundBinaryExpression';
import BoundBinaryOperatorKind from './Binding/BoundBinaryOperatorKind';
import BoundExpression from './Binding/BoundExpression';
import BoundGlobalScopeExpression from './Binding/BoundGlobalScopeExpression';
import BoundLiteralExpression from './Binding/BoundLiteralExpression';
import BoundUnaryExpression from './Binding/BoundUnaryExpression';
import BoundUnaryOperatorKind from './Binding/BoundUnaryOperatorKind';

export default class Evaluator {
  constructor(private readonly _root: BoundExpression) {}

  evaluate() {
    return this.evaluateExpression(this._root);
  }

  private evaluateExpression(expression: BoundExpression): any {
    if (expression instanceof BoundLiteralExpression) return +expression.value;
    if (expression instanceof BoundUnaryExpression) {
      let operand = this.evaluateExpression(expression.operand);

      switch (expression.operator.kind) {
        case BoundUnaryOperatorKind.Identity:
          return operand as number;
        case BoundUnaryOperatorKind.Negation:
          return -operand as number;
        default:
          throw new Error(`Unexpected unary operator ${expression.operator}`);
      }
    }
    if (expression instanceof BoundBinaryExpression) {
      let left = this.evaluateExpression(expression.left);
      let right = this.evaluateExpression(expression.right);

      switch (expression.operator.kind) {
        case BoundBinaryOperatorKind.Addition:
          return +left + +right;
        case BoundBinaryOperatorKind.Subtraction:
          return +left - +right;
        case BoundBinaryOperatorKind.Multiplication:
          return +left * +right;
        case BoundBinaryOperatorKind.Division:
          return +left / +right;
        case BoundBinaryOperatorKind.LogicalAnd:
          return Boolean(left && right);
        case BoundBinaryOperatorKind.LogicalOr:
          return Boolean(left || right);
        case BoundBinaryOperatorKind.Equals:
          return Boolean(left === right);
        case BoundBinaryOperatorKind.NotEquals:
          return Boolean(left !== right);
        default:
          throw new Error(`Unexpected binary operator ${expression.operator}`);
      }
    }
    if (expression instanceof BoundGlobalScopeExpression) {
      const callStack = [];
      for (const expr of expression.expressions) {
        callStack.push(this.evaluateExpression(expr));
      }
      for (const result of callStack) {
        console.log(result);
      }
      return;
    }
  }
}
