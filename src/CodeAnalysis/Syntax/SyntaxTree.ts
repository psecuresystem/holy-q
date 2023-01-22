import ExpressionSyntax from './ExpressionSyntax';
import Parser from './parser';
import Token from './Token';

export default class SyntaxTree {
  constructor(
    public readonly root: ExpressionSyntax,
    private readonly eof: Token
  ) {}

  static parse(text: string) {
    const parser = new Parser(text);
    return parser.parse();
  }
}
