import { SyntaxKind } from '../Typings';

export function getUnaryOperatorPrecedence(kind: SyntaxKind) {
  switch (kind) {
    case SyntaxKind.PLUS_TOKEN:
    case SyntaxKind.MINUS_TOKEN:
    case SyntaxKind.BANG_TOKEN:
      return 6;
    default:
      return 0;
  }
}

export function getBinaryOperatorPrecedence(kind: SyntaxKind) {
  switch (kind) {
    case SyntaxKind.SLASH_TOKEN:
    case SyntaxKind.STAR_TOKEN:
      return 5;
    case SyntaxKind.PLUS_TOKEN:
    case SyntaxKind.MINUS_TOKEN:
      return 4;
    case SyntaxKind.EQUALS_EQUALS_TOKEN:
    case SyntaxKind.BANG_EQUALS_TOKEN:
      return 3;
    case SyntaxKind.AMPERSAND_AMPERSAND_TOKEN:
      return 2;
    case SyntaxKind.PIPE_PIPE_TOKEN:
      return 1;
    default:
      return 0;
  }
}
