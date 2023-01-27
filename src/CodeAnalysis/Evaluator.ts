import BoundAssignmentExpression from './Binding/BoundAssignmentExpression';
import BoundBinaryExpression from './Binding/BoundBinaryExpression';
import BoundBinaryOperatorKind from './Binding/BoundBinaryOperatorKind';
import BoundExpression from './Binding/BoundExpression';
import BoundLiteralExpression from './Binding/BoundLiteralExpression';
import BoundUnaryExpression from './Binding/BoundUnaryExpression';
import BoundUnaryOperatorKind from './Binding/BoundUnaryOperatorKind';
import BoundVariableExpression from './Binding/BoundVariableExpression';
import ComplexNumber from '../Math/ComplexNumber';
import RealNumber from '../Math/RealNumber';
import Scope from './Syntax/Scope';
import BoundCallExpression from './Binding/BoundCallExpression';
import BuiltInFunctions from './Symbols/BuiltinFunctions';
import Qubit from '../QuantumComputing/Qubit';
import XGate from '../QuantumComputing/Gates/XGate';
import YGate from '../QuantumComputing/Gates/YGate';
import ZGate from '../QuantumComputing/Gates/ZGate';
import HGate from '../QuantumComputing/Gates/HGate';
import VariableSymbol from './Symbols/VariableSymbol';
import BoundStatement from './Binding/BoundStatement';
import BoundNodeKind from './Binding/BoundNodeKind';
import BoundBlockStatement from './Binding/BoundBlockStatement';
import BoundExpressionStatement from './Binding/BoundExpressionStatement';
import BoundIfStatement from './Binding/BoundIfStatement';
import BoundGlobalScopeExpression from './Binding/BoundGlobalScope';

export default class Evaluator {
  private _variables: Map<VariableSymbol, any> = new Map();
  private _lastValue: Array<any> = [];
  constructor(private readonly _root: BoundStatement) {}

  evaluate() {
    this.evaluateStatement(this._root);
    return this._lastValue;
  }

  private evaluateStatement(node: BoundStatement) {
    switch (node.kind) {
      case BoundNodeKind.BlockStatement:
        return this.evaluateBlockStatement(node as BoundBlockStatement);
      case BoundNodeKind.ExpressionStatement:
        return this.evaluateExpressionStatement(
          node as BoundExpressionStatement
        );
      case BoundNodeKind.IfStatement:
        return this.evaluateIfStatement(node as BoundIfStatement);
      case BoundNodeKind.GlobalScopeExpression:
        return this.evaluateGlobalScopeStatement(
          node as BoundGlobalScopeExpression
        );
      default:
        throw new Error(`Unexpected node of type ${node.kind}`);
    }
  }

  private evaluateGlobalScopeStatement(node: BoundGlobalScopeExpression) {
    for (const statement of node.expressions) {
      this.evaluateStatement(statement);
    }
  }

  private evaluateIfStatement(node: BoundIfStatement) {
    let condition = this.evaluateExpression(node.condition);
    if (condition) {
      this.evaluateStatement(node.block);
    }
  }

  private evaluateBlockStatement(node: BoundBlockStatement) {
    for (const statement of node.statements) this.evaluateStatement(statement);
  }

  private evaluateExpressionStatement(node: BoundExpressionStatement) {
    let value = this.evaluateExpression(node.expression);
    if (value) {
      this._lastValue.push(value);
    }
  }

  private evaluateExpression(expression: BoundExpression): any {
    if (expression instanceof BoundLiteralExpression)
      return ComplexNumber.fromInt(new RealNumber(expression.value));
    if (expression instanceof BoundUnaryExpression) {
      return this.evaluateUnaryExpression(expression);
    }
    if (expression instanceof BoundBinaryExpression) {
      return this.evaluateBinaryExpression(expression);
    }
    if (expression instanceof BoundAssignmentExpression) {
      return this.evaluateAssignmentExpression(expression);
    }
    if (expression instanceof BoundVariableExpression) {
      return this._variables.get(expression.variable);
    }
    if (expression instanceof BoundCallExpression) {
      return this.evaluateCallExpression(expression);
    }
  }

  private evaluateUnaryExpression(expression: BoundUnaryExpression) {
    let operand = this.evaluateExpression(expression.operand);

    switch (expression.operator.kind) {
      case BoundUnaryOperatorKind.Identity:
        return operand;
      case BoundUnaryOperatorKind.Negation:
        return (operand as ComplexNumber).multiply(
          ComplexNumber.fromInt(new RealNumber(-1))
        );
      case BoundUnaryOperatorKind.LogicalNot:
        return (operand as Qubit).apply(new XGate());
      default:
        throw new Error(`Unexpected unary operator ${expression.operator}`);
    }
  }

  private evaluateBinaryExpression(expression: BoundBinaryExpression) {
    let left = this.evaluateExpression(expression.left);
    let right = this.evaluateExpression(expression.right);

    switch (expression.operator.kind) {
      case BoundBinaryOperatorKind.Addition:
        return (left as ComplexNumber).add(right as ComplexNumber);
      case BoundBinaryOperatorKind.Subtraction:
        return (left as ComplexNumber).subtract(right as ComplexNumber);
      case BoundBinaryOperatorKind.Multiplication:
        return (left as ComplexNumber).multiply(right as ComplexNumber);
      case BoundBinaryOperatorKind.Division:
        return (left as ComplexNumber).divide(right as ComplexNumber);
      case BoundBinaryOperatorKind.LogicalAnd:
        return Boolean(left && right);
      case BoundBinaryOperatorKind.LogicalOr:
        return Boolean(left || right);
      case BoundBinaryOperatorKind.Equals:
        if (left instanceof ComplexNumber && right instanceof ComplexNumber) {
          return Boolean(left.computedValue === right.computedValue);
        }
        return Boolean(left === right);
      case BoundBinaryOperatorKind.NotEquals:
        return Boolean(left !== right);
      default:
        throw new Error(`Unexpected binary operator ${expression.operator}`);
    }
  }

  private evaluateAssignmentExpression(expression: BoundAssignmentExpression) {
    let value = this.evaluateExpression(expression.value);
    this._variables.set(expression.variable, value);
    return;
  }

  private evaluateCallExpression(expression: BoundCallExpression) {
    let inbuiltFunctions = BuiltInFunctions;
    if (Object.values(inbuiltFunctions).includes(expression.func)) {
      let evaluatedQubit: Qubit;
      switch (expression.func) {
        case BuiltInFunctions.X:
          let X = new XGate();
          evaluatedQubit = this.evaluateExpression(
            expression.functionArguments[0]
          );
          return evaluatedQubit.apply(X);
        case BuiltInFunctions.Y:
          let Y = new YGate();
          evaluatedQubit = this.evaluateExpression(
            expression.functionArguments[0]
          );
          return evaluatedQubit.apply(Y);
        case BuiltInFunctions.Z:
          let Z = new ZGate();
          evaluatedQubit = this.evaluateExpression(
            expression.functionArguments[0]
          );
          return evaluatedQubit.apply(Z);
        case BuiltInFunctions.H:
          let H = new HGate();
          evaluatedQubit = this.evaluateExpression(
            expression.functionArguments[0]
          );
          return evaluatedQubit.apply(H);
        case BuiltInFunctions.Q:
          if (
            (expression.functionArguments[0] as BoundLiteralExpression).value >
            0
          ) {
            return Qubit.fromBit(1);
          }
          return Qubit.fromBit(0);
        default:
          return null;
      }
    }
  }
}
