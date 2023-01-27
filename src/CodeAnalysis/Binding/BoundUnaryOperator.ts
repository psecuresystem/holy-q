import { SyntaxKind } from '../Typings';
import BoundUnaryOperatorKind from './BoundUnaryOperatorKind';
import Types from './Types';

export default class BoundUnaryOperator {
  constructor(
    readonly syntaxKind: SyntaxKind,
    readonly kind: BoundUnaryOperatorKind,
    readonly operandType: Types,
    readonly resultType = operandType
  ) {}

  private static operators = [
    new BoundUnaryOperator(
      SyntaxKind.PLUS_TOKEN,
      BoundUnaryOperatorKind.Identity,
      Types.Number
    ),
    new BoundUnaryOperator(
      SyntaxKind.MINUS_TOKEN,
      BoundUnaryOperatorKind.Negation,
      Types.Number
    ),
    new BoundUnaryOperator(
      SyntaxKind.BANG_TOKEN,
      BoundUnaryOperatorKind.LogicalNot,
      Types.Qubit
    ),
  ];

  static bind(
    syntaxKind: SyntaxKind,
    operandType: Types
  ): BoundUnaryOperator | null {
    for (const op of BoundUnaryOperator.operators) {
      if (op.syntaxKind == syntaxKind && op.operandType == operandType) {
        return op;
      }
    }
    return null;
  }
}
