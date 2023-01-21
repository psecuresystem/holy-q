import { reporter } from '../..';
import Reporter from '../Report';
import BinaryExpressionSyntax from '../Syntax/BinaryExpressionSyntax';
import ExpressionSyntax from '../Syntax/ExpressionSyntax';
import LiteralExpressionSyntax from '../Syntax/LiteralExpressionSyntax';
import UnaryExpressionSyntax from '../Syntax/UnaryExpressionSyntax';
import { SyntaxKind } from '../Typings';
import BoundBinaryExpression from './BoundBinaryExpression';
import BoundBinaryOperator from './BoundBinaryOperator';
import BoundExpression from './BoundExpression';
import BoundLiteralExpression from './BoundLiteralExpression';
import BoundUnaryExpression from './BoundUnaryExpression';
import BoundUnaryOperator from './BoundUnaryOperator';
import BoundUnaryOperatorKind from './BoundUnaryOperatorKind';
import Types from './Types';

export default class Binder {
  bindExpression(syntax: ExpressionSyntax): BoundExpression {
    switch (syntax.kind) {
      case SyntaxKind.LITERAL_EXPRESSION:
        return this.bindLiteralExpression(syntax as LiteralExpressionSyntax);
      case SyntaxKind.UNARY_EXPRESSION:
        return this.bindUnaryExpression(syntax as UnaryExpressionSyntax);
      case SyntaxKind.BINARY_EXPRESSION:
        return this.bindBinaryExpression(syntax as BinaryExpressionSyntax);
      default:
        reporter.reportUnexpectedSyntax('Unexpected syntax');
        throw new Error('');
    }
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
}
