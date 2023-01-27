import { SyntaxKind } from '../Typings';

export function getKeywordKind(keyword: string): SyntaxKind {
  switch (keyword) {
    case 'let':
      return SyntaxKind.LET_KEYWORD;
    case 'mut':
      return SyntaxKind.MUT_TOKEN;
    case 'int':
      return SyntaxKind.INT_TOKEN;
    case 'if':
      return SyntaxKind.IF_TOKEN;
    case 'String':
      return SyntaxKind.STRING_TOKEN;
    default:
      return SyntaxKind.IDENTIFIER_TOKEN;
  }
}
