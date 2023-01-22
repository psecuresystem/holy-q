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
      'number'
    ),
    new BoundBinaryOperator(
      SyntaxKind.MINUS_TOKEN,
      BoundBinaryOperatorKind.Subtraction,
      'number'
    ),
    new BoundBinaryOperator(
      SyntaxKind.STAR_TOKEN,
      BoundBinaryOperatorKind.Multiplication,
      'number'
    ),
    new BoundBinaryOperator(
      SyntaxKind.SLASH_TOKEN,
      BoundBinaryOperatorKind.Division,
      'number'
    ),
    new BoundBinaryOperator(
      SyntaxKind.AMPERSAND_AMPERSAND_TOKEN,
      BoundBinaryOperatorKind.LogicalAnd,
      'boolean'
    ),
    new BoundBinaryOperator(
      SyntaxKind.PIPE_PIPE_TOKEN,
      BoundBinaryOperatorKind.LogicalOr,
      'boolean'
    ),
    new BoundBinaryOperator(
      SyntaxKind.EQUALS_EQUALS_TOKEN,
      BoundBinaryOperatorKind.Equals,
      'boolean'
    ),
    new BoundBinaryOperator(
      SyntaxKind.BANG_EQUALS_TOKEN,
      BoundBinaryOperatorKind.NotEquals,
      'boolean'
    ),
    new BoundBinaryOperator(
      SyntaxKind.EQUALS_EQUALS_TOKEN,
      BoundBinaryOperatorKind.Equals,
      'number',
      'number',
      'boolean'
    ),
    new BoundBinaryOperator(
      SyntaxKind.BANG_EQUALS_TOKEN,
      BoundBinaryOperatorKind.NotEquals,
      'number',
      'number',
      'boolean'
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
