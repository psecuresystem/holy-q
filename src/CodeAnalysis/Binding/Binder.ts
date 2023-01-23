import { reporter } from '../..';
import Reporter from '../Report';
import AssignmentSyntax from '../Syntax/AssignmentSyntax';
import BinaryExpressionSyntax from '../Syntax/BinaryExpressionSyntax';
import ExpressionSyntax from '../Syntax/ExpressionSyntax';
import GlobalScopeSyntax from '../Syntax/GlobalScopeSyntax';
import LiteralExpressionSyntax from '../Syntax/LiteralExpressionSyntax';
import NameExpressionSyntax from '../Syntax/NameExpressionSyntax';
import ParenthesizedExpressionSyntax from '../Syntax/ParenthesizedExpressionSyntax';
import ReAssignmentSyntax from '../Syntax/ReAssignmentSyntax';
import Scope from '../Syntax/Scope';
import UnaryExpressionSyntax from '../Syntax/UnaryExpressionSyntax';
import { SyntaxKind, Variable } from '../Typings';
import VariableSymbol from '../VariableSymbol';
import BoundAssignmentExpression from './BoundAssignmentExpression';
import BoundBinaryExpression from './BoundBinaryExpression';
import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundGlobalScopeExpression from './BoundGlobalScopeExpression';
import BoundLiteralExpression from './BoundLiteralExpression';
import BoundUnaryExpression from './BoundUnaryExpression';
import BoundUnaryOperator from './BoundUnaryOperator';
import BoundUnaryOperatorKind from './BoundUnaryOperatorKind';
import BoundVariableExpression from './BoundVariableExpression';
import Types from './Types';

export default class Binder {
  private _scope: Scope;
  constructor(private readonly globalScope: Scope) {
    this._scope = globalScope;
  }

  bindExpression(syntax: ExpressionSyntax): BoundExpression {
    switch (syntax.kind) {
      case SyntaxKind.PARENTHESIZED_EXPRESSION:
        return this.bindParenthesizedExpression(
          syntax as ParenthesizedExpressionSyntax
        );
      case SyntaxKind.LITERAL_EXPRESSION:
        return this.bindLiteralExpression(syntax as LiteralExpressionSyntax);
      case SyntaxKind.UNARY_EXPRESSION:
        return this.bindUnaryExpression(syntax as UnaryExpressionSyntax);
      case SyntaxKind.BINARY_EXPRESSION:
        return this.bindBinaryExpression(syntax as BinaryExpressionSyntax);
      case SyntaxKind.GLOBAL_SCOPE_EXPRESSION:
        return this.bindGlobalScopeExpression(syntax as GlobalScopeSyntax);
      case SyntaxKind.ASSIGNMENT_EXPRESSION:
        return this.bindAssignmentExpression(syntax as AssignmentSyntax);
      case SyntaxKind.REASSIGNMENT_EXPRESSION:
        return this.bindReAssignmentExpression(syntax as ReAssignmentSyntax);
      case SyntaxKind.NAME_EXPRESSION_SYNTAX:
        return this.bindNameExpression(syntax as NameExpressionSyntax);
      default:
        reporter.reportUnexpectedSyntax('Unexpected syntax');
        throw new Error('');
    }
  }

  bindReAssignmentExpression(syntax: ReAssignmentSyntax): BoundExpression {
    let name = syntax.identifierToken.value;
    let variable: Variable | undefined;
    let variableSymbol: VariableSymbol | undefined;
    this._scope.variables.forEach((value, key) => {
      if (key.name == name) {
        variable = value;
        variableSymbol = key;
      }
    });
    if (!variable || !variableSymbol) {
      reporter.reportUndefinedName(name);
      return new BoundLiteralExpression(0);
    }
    let newValue = this.bindExpression(syntax.expression);
    if (newValue.type !== variable.type) {
      reporter.reportInvalidTypeSetting();
      return new BoundLiteralExpression(0);
    }
    if (variableSymbol.mutable == false) {
      reporter.reportAttemptedImmutableReassignment();
      return new BoundLiteralExpression(0);
    }
    this._scope.setVariable(variableSymbol, newValue);

    return new BoundAssignmentExpression(variableSymbol, newValue);
  }

  bindNameExpression(syntax: NameExpressionSyntax): BoundExpression {
    let name = syntax.identifierToken.value;
    let variable;
    this._scope.variables.forEach((value, key) => {
      if (key.name == name) {
        variable = value;
      }
    });
    if (!variable) {
      reporter.reportUndefinedName(name);
      return new BoundLiteralExpression(0);
    }
    return new BoundVariableExpression(name, 'number');
  }

  bindAssignmentExpression(syntax: AssignmentSyntax): BoundExpression {
    let name = syntax.identifierToken.value;
    let expression = this.bindExpression(syntax.expression);
    let mutable = syntax.mutable;
    let symbol = new VariableSymbol(name, expression.type, mutable);
    this._scope.setVariable(symbol, expression);

    return new BoundAssignmentExpression(symbol, expression);
  }

  bindLiteralExpression(syntax: LiteralExpressionSyntax) {
    let value = syntax.value ?? 0;
    return new BoundLiteralExpression(value);
  }

  bindUnaryExpression(syntax: UnaryExpressionSyntax) {
    let boundOperand = this.bindExpression(syntax.operand);
    let boundOperator = BoundUnaryOperator.bind(
      syntax.operator.kind,
      boundOperand.type
    );

    if (boundOperator == null) {
      reporter.reportTypeMismatchError(
        `Unary operator '${syntax.operator}' is not defined for type ${boundOperand.type}.`
      );
      return boundOperand;
    }

    return new BoundUnaryExpression(boundOperator, boundOperand);
  }

  bindBinaryExpression(syntax: BinaryExpressionSyntax) {
    let boundLeft = this.bindExpression(syntax.left);
    let boundRight = this.bindExpression(syntax.right);
    let boundOperator = BoundBinaryOperator.bind(
      syntax.operatorToken.kind,
      boundLeft.type,
      boundRight.type
    );

    if (boundOperator == null) {
      reporter.reportTypeMismatchError(
        `Binary operator '${syntax.operatorToken}' is not defined for types ${boundLeft.type} and ${boundRight.type}.`
      );
      return boundLeft;
    }

    return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
  }

  bindUnaryOperatorKind(kind: SyntaxKind, operandType: Types) {
    if (operandType != 'number') return null;
    switch (kind) {
      case SyntaxKind.PLUS_TOKEN:
        return BoundUnaryOperatorKind.Identity;
      case SyntaxKind.MINUS_TOKEN:
        return BoundUnaryOperatorKind.Negation;
      default:
        throw new Error(`Unexpected unary operator ${kind}`);
    }
  }

  bindGlobalScopeExpression(syntax: GlobalScopeSyntax): BoundExpression {
    const expressions = [];
    for (const expression of syntax.expressions) {
      expressions.push(this.bindExpression(expression));
    }
    return new BoundGlobalScopeExpression(expressions);
  }

  bindParenthesizedExpression(syntax: ParenthesizedExpressionSyntax) {
    return this.bindExpression(syntax.expression);
  }
}
