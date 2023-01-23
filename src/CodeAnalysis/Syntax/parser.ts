import { reporter } from '../..';
import { SyntaxKind } from '../Typings';
import {
  getBinaryOperatorPrecedence,
  getUnaryOperatorPrecedence,
} from '../Utils/precedence';
import AssignmentSyntax from './AssignmentSyntax';
import BinaryExpressionSyntax from './BinaryExpressionSyntax';
import ExpressionSyntax from './ExpressionSyntax';
import GlobalScopeSyntax from './GlobalScopeSyntax';
import Lexer from './lexer';
import LiteralExpressionSyntax from './LiteralExpressionSyntax';
import NameExpressionSyntax from './NameExpressionSyntax';
import ParenthesizedExpressionSyntax from './ParenthesizedExpressionSyntax';
import ReAssignmentSyntax from './ReAssignmentSyntax';
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

  peek(range: number): Token {
    if (this.pointer + range >= this._statement.length) {
      return this._statement[this._statement.length - 1];
    }
    return this._statement[this.pointer + range];
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
    return this.parseAssignmentExpression(parentPrecedence);
  }

  parseAssignmentExpression(parentPrecedence = 0): ExpressionSyntax {
    if (this.currentToken.kind == SyntaxKind.LET_KEYWORD) {
      let left = this.nextToken();
      let mutability = false;
      let mutabilityToken;
      if ((this.currentToken.kind as any) == SyntaxKind.MUT_TOKEN) {
        mutabilityToken = this.nextToken();
        mutability = true;
      }
      let identifierToken = this.match(SyntaxKind.IDENTIFIER_TOKEN);
      let assignmentToken = this.match(SyntaxKind.EQUALS_TOKEN);
      let expression = this.parseExpression();
      return new AssignmentSyntax(
        left,
        identifierToken,
        mutability,
        assignmentToken,
        expression
      );
    } else if (
      this.currentToken.kind == SyntaxKind.IDENTIFIER_TOKEN &&
      this.peek(1).kind == SyntaxKind.EQUALS_TOKEN
    ) {
      let identifierToken = this.match(SyntaxKind.IDENTIFIER_TOKEN);
      let assignmentToken = this.match(SyntaxKind.EQUALS_TOKEN);
      let expression = this.parseExpression();
      return new ReAssignmentSyntax(
        identifierToken,
        assignmentToken,
        expression
      );
    } else {
      return this.parseBinaryExpression(parentPrecedence);
    }
  }

  parseBinaryExpression(parentPrecedence = 0): ExpressionSyntax {
    let left;
    let unaryPrecedence = getUnaryOperatorPrecedence(this.currentToken.kind);
    if (unaryPrecedence >= parentPrecedence && unaryPrecedence != 0) {
      let operatorToken = this.nextToken();
      let operand = this.parseBinaryExpression(unaryPrecedence);
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
    switch (this.currentToken.kind) {
      case SyntaxKind.OPEN_BRACKET_TOKEN:
        var left = this.nextToken();
        var expression = this.parseExpression();
        var right = this.match(SyntaxKind.CLOSE_BRACKET_TOKEN);
        return new ParenthesizedExpressionSyntax(left, expression, right);
      case SyntaxKind.IDENTIFIER_TOKEN:
        let identifierToken = this.nextToken();
        return new NameExpressionSyntax(identifierToken);
      default:
        let numberToken = this.match(SyntaxKind.LITERAL_TOKEN);
        return new LiteralExpressionSyntax(numberToken);
    }
  }
}
