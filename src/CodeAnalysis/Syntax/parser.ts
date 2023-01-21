import { reporter } from '../..';
import { SyntaxKind } from '../Typings';
import {
  getBinaryOperatorPrecedence,
  getUnaryOperatorPrecedence,
} from '../Utils/precedence';
import BinaryExpressionSyntax from './BinaryExpressionSyntax';
import ExpressionSyntax from './ExpressionSyntax';
import Lexer from './lexer';
import LiteralExpressionSyntax from './LiteralExpressionSyntax';
import ParenthesizedExpressionSyntax from './ParenthesizedExpressionSyntax';
import SyntaxNode from './SyntaxNode';
import SyntaxTree from './SyntaxTree';
import Token from './Token';
import UnaryExpressionSyntax from './UnaryExpressionSyntax';

export default class Parser {
  tokens: Token[];
  pointer: number = 0;
  constructor(private readonly text: string) {
    const lexer = new Lexer(text);
    const tokens = lexer.lex();
    this.tokens = tokens.filter(
      (token) => token.kind != SyntaxKind.WHITESPACE_TOKEN
    );
  }

  get currentToken(): Token {
    if (this.pointer >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.pointer];
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

  parse() {
    let expression = this.parseExpression();
    let endOfFileToken = this.match(SyntaxKind.END_OF_FILE_TOKEN);
    return new SyntaxTree(expression, endOfFileToken);
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
