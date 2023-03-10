export enum SyntaxKind {
  // Tokens
  WHITESPACE_TOKEN = 'whitespace token',
  LITERAL_TOKEN = 'literal token',
  OPERATOR_TOKEN = 'operator token',
  END_OF_FILE_TOKEN = 'END_OF_FILE_TOKEN',
  PLUS_TOKEN = 'PLUS_TOKEN',
  MINUS_TOKEN = 'MINUS_TOKEN',
  SLASH_TOKEN = 'SLASH_TOKEN',
  STAR_TOKEN = 'STAR_TOKEN',
  UNDEFINED_TOKEN = 'UNDEFINED_TOKEN',
  CLOSE_BRACKET_TOKEN = 'CLOSE_BRACKET_TOKEN',
  PIPE_TOKEN = 'PIPE_TOKEN',
  AMPERSAND_TOKEN = 'AMPERSAND_TOKEN',
  AMPERSAND_AMPERSAND_TOKEN = 'AMPERSAND_AMPERSAND_TOKEN',
  PIPE_PIPE_TOKEN = 'PIPE_PIPE_TOKEN',
  OPEN_BRACKET_TOKEN = 'OPEN_BRACKET_TOKEN',
  // Expressions
  UNARY_EXPRESSION = 'UNARY_EXPRESSION',
  LITERAL_EXPRESSION = 'LITERAL_EXPRESSION',
  PARENTHESIZED_EXPRESSION = 'PARENTHESIZED_EXPRESSION',
  BINARY_EXPRESSION = 'BINARY_EXPRESSION',
  EQUALS_EQUALS_TOKEN = 'EQUALS_EQUALS_TOKEN',
  BANG_EQUALS_TOKEN = 'BANG_EQUALS_TOKEN',
  SOME_SPACE_TOKEN = 'SOME_SPACE_TOKEN',
  END_OF_STATEMENT_TOKEN = 'END_OF_STATEMENT_TOKEN',
  GLOBAL_SCOPE_EXPRESSION = 'GLOBAL_SCOPE_EXPRESSION',
}

export type operators = '+' | '-' | '*' | '/';
