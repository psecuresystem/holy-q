import { reporter } from '../..';
import { SyntaxKind } from '../Typings';
import {
  getBinaryOperatorPrecedence,
  getUnaryOperatorPrecedence,
} from '../Utils/precedence';
import BinaryExpressionSyntax from './BinaryExpressionSyntax';
import ExpressionSyntax from './ExpressionSyntax';
import GlobalScopeSyntax from './GlobalScopeSyntax';
import Lexer from './lexer';
import LiteralExpressionSyntax from './LiteralExpressionSyntax';
import ParenthesizedExpressionSyntax from './ParenthesizedExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import SyntaxTree from './SyntaxTree';
import Token from './Token';
import UnaryExpressionSyntax from './UnaryExpressionSyntax';

export default class Parser {
  tokens: Token[];
  private _statement: Token[] = [];
  pointer: number = 0;
  eof?: Token;
  constructor(private readonly text: string) {
    const lexer = new Lexer(text);
    const tokens = lexer.lex();
    this.tokens = tokens.filter(
      (token) => token.kind != SyntaxKind.WHITESPACE_TOKEN
    );
  }

  get currentToken(): Token {
    if (this.pointer >= this._statement.length) {
      return this._statement[this._statement.length - 1];
    }
    return this._statement[this.pointer];
  }

  nextToken(): Token {
    const token = this.currentToken;
    this.pointer++;
    return token;
  }

  match(kind: SyntaxKind): Token {
    if (this.currentToken.kind == kind) {
      return this.nextToken();
    } else {
      reporter.reportUnexpectedSyntax(
        `Unexpected Token found at 1:${
          this.pointer + 1
        }. Expected ${kind} but found ${this.currentToken.kind}`
      );
      return new Token(this.currentToken.start, null, kind);
    }
  }

  *getStatements(): IterableIterator<Token[]> {
    let statement: Token[] = [];
    for (const token of this.tokens) {
      if (token.kind == SyntaxKind.END_OF_STATEMENT_TOKEN) {
        yield statement;
        statement = [];
      } else if (token.kind == SyntaxKind.END_OF_FILE_TOKEN) {
        this.eof = token;
        if (statement.length == 0) return;
        return yield statement;
      } else {
        statement.push(token);
      }
    }
  }

  parse() {
    let expressions = this.parseStatements();
    const scope = new GlobalScopeSyntax(expressions);
    return new SyntaxTree(scope, this.eof!);
  }

  parseStatements(): ExpressionSyntax[] {
    const expressions = [];
    for (let statement of this.getStatements()) {
      this._statement = statement;
      this.pointer = 0;
      const expression = this.parseExpression();
      expressions.push(expression);
    }
    return expressions;
  }

  parseExpression(parentPrecedence = 0): ExpressionSyntax {
    let left;
    let unaryPrecedence = getUnaryOperatorPrecedence(this.currentToken.kind);
    if (unaryPrecedence >= parentPrecedence && unaryPrecedence != 0) {
      let operatorToken = this.nextToken();
      let operand = this.parseExpression(unaryPrecedence);
      left = new UnaryExpressionSyntax(operatorToken, operand);
    } else {
      left = this.parsePrimaryExpression();
    }

    while (true) {
      let precedence = getBinaryOperatorPrecedence(this.currentToken.kind);
      if (precedence == 0 || precedence <= parentPrecedence) break;
      let operatorToken = this.nextToken();
      let right = this.parseExpression(precedence);
      left = new BinaryExpressionSyntax(left, operatorToken, right);
    }

    return left;
  }

  parsePrimaryExpression(): ExpressionSyntax {
    if (this.currentToken.kind == SyntaxKind.OPEN_BRACKET_TOKEN) {
      var left = this.nextToken();
      var expression = this.parseExpression();
      var right = this.match(SyntaxKind.CLOSE_BRACKET_TOKEN);
      return new ParenthesizedExpressionSyntax(left, expression, right);
    }
    let numberToken = this.match(SyntaxKind.LITERAL_TOKEN);
    return new LiteralExpressionSyntax(numberToken);
  }
}
