import { SyntaxKind } from '../Typings';
import BoundBinaryOperatorKind from './BoundBinaryOperatorKind';
import Types from './Types';

export default class BoundBinaryOperator {
  constructor(
    readonly syntaxKind: SyntaxKind,
    readonly kind: BoundBinaryOperatorKind,
    readonly leftType: Types,
    readonly rightType: Types = leftType,
    readonly resultType = leftType
  ) {}

  private static operators = [
    new BoundBinaryOperator(
      SyntaxKind.PLUS_TOKEN,
      BoundBinaryOperatorKind.Addition,
      Types.Number
    ),
    new BoundBinaryOperator(
      SyntaxKind.MINUS_TOKEN,
      BoundBinaryOperatorKind.Subtraction,
      Types.Number
    ),
    new BoundBinaryOperator(
      SyntaxKind.STAR_TOKEN,
      BoundBinaryOperatorKind.Multiplication,
      Types.Number
    ),
    new BoundBinaryOperator(
      SyntaxKind.SLASH_TOKEN,
      BoundBinaryOperatorKind.Division,
      Types.Number
    ),
    new BoundBinaryOperator(
      SyntaxKind.AMPERSAND_AMPERSAND_TOKEN,
      BoundBinaryOperatorKind.LogicalAnd,
      Types.Boolean
    ),
    new BoundBinaryOperator(
      SyntaxKind.PIPE_PIPE_TOKEN,
      BoundBinaryOperatorKind.LogicalOr,
      Types.Boolean
    ),
    new BoundBinaryOperator(
      SyntaxKind.EQUALS_EQUALS_TOKEN,
      BoundBinaryOperatorKind.Equals,
      Types.Boolean
    ),
    new BoundBinaryOperator(
      SyntaxKind.BANG_EQUALS_TOKEN,
      BoundBinaryOperatorKind.NotEquals,
      Types.Boolean
    ),
    new BoundBinaryOperator(
      SyntaxKind.EQUALS_EQUALS_TOKEN,
      BoundBinaryOperatorKind.Equals,
      Types.Number,
      Types.Number,
      Types.Boolean
    ),
    new BoundBinaryOperator(
      SyntaxKind.BANG_EQUALS_TOKEN,
      BoundBinaryOperatorKind.NotEquals,
      Types.Number,
      Types.Number,
      Types.Boolean
    ),
  ];

  static bind(
    syntaxKind: SyntaxKind,
    leftType: Types,
    rightType: Types
  ): BoundBinaryOperator | null {
    for (const op of BoundBinaryOperator.operators) {
      if (
        op.syntaxKind == syntaxKind &&
        op.leftType == leftType &&
        op.rightType == rightType
      ) {
        return op;
      }
    }
    return null;
  }
}
