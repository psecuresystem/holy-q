import { reporter } from '../..';
import Reporter from '../Report';
import AssignmentSyntax from '../Syntax/AssignmentSyntax';
import BinaryExpressionSyntax from '../Syntax/BinaryExpressionSyntax';
import CallExpressionSyntax from '../Syntax/CallExpressionSyntax';
import ExpressionSyntax from '../Syntax/ExpressionSyntax';
import GlobalScopeSyntax from '../Syntax/GlobalScopeSyntax';
import LiteralExpressionSyntax from '../Syntax/LiteralExpressionSyntax';
import NameExpressionSyntax from '../Syntax/NameExpressionSyntax';
import ParenthesizedExpressionSyntax from '../Syntax/ParenthesizedExpressionSyntax';
import ReAssignmentSyntax from '../Syntax/ReAssignmentSyntax';
import Scope from '../Syntax/Scope';
import UnaryExpressionSyntax from '../Syntax/UnaryExpressionSyntax';
import { SyntaxKind } from '../Typings';
import VariableSymbol from '../Symbols/VariableSymbol';
import BoundAssignmentExpression from './BoundAssignmentExpression';
import BoundBinaryExpression from './BoundBinaryExpression';
import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundGlobalScope from './BoundGlobalScope';
import BoundLiteralExpression from './BoundLiteralExpression';
import BoundUnaryExpression from './BoundUnaryExpression';
import BoundUnaryOperator from './BoundUnaryOperator';
import BoundUnaryOperatorKind from './BoundUnaryOperatorKind';
import BoundVariableExpression from './BoundVariableExpression';
import Types from './Types';
import BoundCallExpression from './BoundCallExpression';
import IfExpressionSyntax from '../Syntax/IfStatementSyntax';
import BlockExpressionSyntax from '../Syntax/BlockStatementSyntax';
import BoundBlockStatement from './BoundBlockStatement';
import BoundStatement from './BoundStatement';
import BoundExpressionStatement from './BoundExpressionStatement';
import ExpressionStatementSyntax from '../Syntax/ExpressionStatementSyntax';
import BoundIfStatement from './BoundIfStatement';

export default class Binder {
  private _scope: Scope;
  constructor(private readonly globalScope: Scope) {
    this._scope = globalScope;
  }

  bindStatement(syntax: ExpressionSyntax): BoundStatement {
    switch (syntax.kind) {
      case SyntaxKind.IF_STATEMENT_EXPRESSION:
        return this.bindIfStatement(syntax as IfExpressionSyntax);
      case SyntaxKind.BLOCK_EXPRESSION:
        return this.bindBlockSyntax(syntax as BlockExpressionSyntax);
      case SyntaxKind.EXPRESSION_STATEMENT:
        return this.bindExpressionStatement(
          syntax as ExpressionStatementSyntax
        );
      default:
        reporter.reportUnexpectedSyntax('Unexpected syntax');
        throw new Error(`Unexpected statement ${syntax.kind}`);
    }
  }

  bindIfStatement(syntax: IfExpressionSyntax): BoundStatement {
    let condition = this.bindExpressionStatement(
      syntax.condition as ExpressionStatementSyntax
    );
    let block = this.bindBlockSyntax(syntax.statements);
    if (condition.expression.type !== Types.Boolean) {
      reporter.reportInvalidIfStatementCondition(condition.expression.type);
    }
    return new BoundIfStatement(condition.expression, block);
  }

  bindBlockSyntax(syntax: BlockExpressionSyntax): BoundStatement {
    let statements = [];
    this._scope = new Scope(this._scope);

    for (const statementSyntax of syntax.statements) {
      const statement = this.bindStatement(statementSyntax);
      statements.push(statement);
    }

    this._scope = this._scope.parent!;
    return new BoundBlockStatement(statements);
  }

  bindExpressionStatement(syntax: ExpressionStatementSyntax) {
    let expression = this.bindExpression(syntax.expression);
    return new BoundExpressionStatement(expression);
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
      case SyntaxKind.CALL_EXPRESSION:
        return this.bindCallExpression(syntax as CallExpressionSyntax);
      default:
        reporter.reportUnexpectedSyntax('Unexpected syntax');
        throw new Error(`Unexpected Syntax ${syntax.kind}`);
    }
  }

  bindCallExpression(syntax: CallExpressionSyntax): BoundExpression {
    const boundArguments = [];
    for (const argument of syntax.functionArguments.getNodes()) {
      const boundArgument = this.bindExpression(argument);
      boundArguments.push(boundArgument);
    }
    let func = this._scope.getFunction(syntax.identifier.value);
    if (!func) {
      reporter.reportUndefinedFunction(syntax.identifier.value);
      return new BoundLiteralExpression(0);
    }
    if (syntax.functionArguments.count != func.parameters.length) {
      reporter.reportWrongArgumentsCount(
        syntax.identifier.value,
        syntax.functionArguments.count,
        func.parameters.length
      );
      return new BoundLiteralExpression(0);
    }

    for (let i = 0; i < syntax.functionArguments.count; i++) {
      let argument = boundArguments[i];
      let parameter = func.parameters[i];
      if (argument.type != parameter.type) {
        reporter.reportInvalidParameterType(
          syntax.identifier.value,
          argument.type,
          parameter.type
        );
        return new BoundLiteralExpression(0);
      }
    }

    return new BoundCallExpression(func, boundArguments);
  }

  bindReAssignmentExpression(syntax: ReAssignmentSyntax): BoundExpression {
    let name = syntax.identifierToken.value;
    let variableSymbol = this._scope.variables.get(name);
    if (!variableSymbol) {
      reporter.reportUndefinedName(name);
      return new BoundLiteralExpression(0);
    }
    let newValue = this.bindExpression(syntax.expression);
    if (newValue.type !== variableSymbol.type) {
      reporter.reportInvalidTypeSetting();
      return new BoundLiteralExpression(0);
    }
    if (variableSymbol.mutable == false) {
      reporter.reportAttemptedImmutableReassignment();
      return new BoundLiteralExpression(0);
    }
    this._scope.setVariable(variableSymbol);

    return new BoundAssignmentExpression(variableSymbol, newValue);
  }

  bindNameExpression(syntax: NameExpressionSyntax): BoundExpression {
    let name = syntax.identifierToken.value;
    let variableSymbol: VariableSymbol | undefined = this._scope.variables.get(
      syntax.identifierToken.value
    );
    if (!variableSymbol) {
      reporter.reportUndefinedName(name);
      return new BoundLiteralExpression(0);
    }
    return new BoundVariableExpression(variableSymbol, variableSymbol.type);
  }

  bindAssignmentExpression(syntax: AssignmentSyntax): BoundExpression {
    let name = syntax.identifierToken.value;
    let expression = this.bindExpression(syntax.expression);
    let mutable = syntax.mutable;
    let symbol = new VariableSymbol(name, expression.type, mutable);
    this._scope.createVariable(symbol);

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
        `Binary operator '${syntax.operatorToken.kind}' is not defined for types ${boundLeft.type} and ${boundRight.type}.`
      );
      return boundLeft;
    }

    return new BoundBinaryExpression(boundLeft, boundOperator, boundRight);
  }

  bindUnaryOperatorKind(kind: SyntaxKind, operandType: Types) {
    if (operandType != Types.Number) return null;
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
    const statements = [];
    for (const statement of syntax.expressions) {
      statements.push(this.bindStatement(statement));
    }
    return new BoundGlobalScope(statements);
  }

  bindParenthesizedExpression(syntax: ParenthesizedExpressionSyntax) {
    return this.bindExpression(syntax.expression);
  }
}
