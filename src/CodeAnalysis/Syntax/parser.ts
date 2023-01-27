import { reporter } from '../..';
import { SyntaxKind } from '../Typings';
import {
  getBinaryOperatorPrecedence,
  getUnaryOperatorPrecedence,
} from '../Utils/precedence';
import AssignmentSyntax from './AssignmentSyntax';
import BinaryExpressionSyntax from './BinaryExpressionSyntax';
import BlockStatementSyntax from './BlockStatementSyntax';
import CallExpressionSyntax from './CallExpressionSyntax';
import ExpressionStatementSyntax from './ExpressionStatementSyntax';
import ExpressionSyntax from './ExpressionSyntax';
import GlobalScopeSyntax from './GlobalScopeSyntax';
import IfStatementSyntax from './IfStatementSyntax';
import Lexer from './lexer';
import LiteralExpressionSyntax from './LiteralExpressionSyntax';
import NameExpressionSyntax from './NameExpressionSyntax';
import ParenthesizedExpressionSyntax from './ParenthesizedExpressionSyntax';
import ReAssignmentSyntax from './ReAssignmentSyntax';
import SeperatedSyntaxList from './SeperatedSyntaxList';
import StatementSyntax from './StatementSyntax';
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

  peek(range: number): Token {
    if (this.pointer + range >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.pointer + range];
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
    let statements: Token[] = [];
    for (const token of this.tokens) {
      if (token.kind == SyntaxKind.END_OF_STATEMENT_TOKEN) {
        yield statements;
        statements = [];
      } else if (token.kind == SyntaxKind.END_OF_FILE_TOKEN) {
        this.eof = token;
        if (statements.length == 0) return;
        return yield statements;
      } else {
        statements.push(token);
      }
    }
    console.log('statements', statements);
    return statements;
  }

  parse() {
    let expressions = this.parseStatements();
    const scope = new GlobalScopeSyntax(expressions);
    return new SyntaxTree(scope, this.eof!);
  }

  parseStatements(): ExpressionSyntax[] {
    const expressions = [];
    while (
      this.currentToken.kind != SyntaxKind.END_OF_FILE_TOKEN &&
      this.currentToken.kind != SyntaxKind.CLOSE_CURLY_BRACE_TOKEN
    ) {
      let expression = this.parseStatement();
      if (
        (this.currentToken.kind as any) != SyntaxKind.END_OF_FILE_TOKEN &&
        (this.currentToken.kind as any) != SyntaxKind.CLOSE_CURLY_BRACE_TOKEN
      ) {
        this.match(SyntaxKind.END_OF_STATEMENT_TOKEN);
      }
      expressions.push(expression);
    }
    return expressions;
  }

  parseStatement(parentPrecedence = 0): StatementSyntax {
    switch (this.currentToken.kind) {
      case SyntaxKind.IF_TOKEN:
        return this.parseIfStatement();
      case SyntaxKind.OPEN_CURLY_BRACE_TOKEN:
        return this.parseBlockStatement();
      default:
        return this.parseExpressionStatement(parentPrecedence);
    }
  }

  parseExpressionStatement(parentPrecedence = 0) {
    let expression = this.parseExpression(parentPrecedence);
    return new ExpressionStatementSyntax(expression);
  }

  parseExpression(parentPrecedence = 0) {
    return this.parseAssignmentExpression(parentPrecedence);
  }

  parseBlockStatement(): BlockStatementSyntax {
    const statements = [];
    let open_curly_brace = this.match(SyntaxKind.OPEN_CURLY_BRACE_TOKEN);
    while (
      this.currentToken.kind != SyntaxKind.END_OF_FILE_TOKEN &&
      this.currentToken.kind != SyntaxKind.CLOSE_CURLY_BRACE_TOKEN
    ) {
      let statement = this.parseStatement();
      if (
        (this.currentToken.kind as any) != SyntaxKind.END_OF_FILE_TOKEN &&
        (this.currentToken.kind as any) != SyntaxKind.CLOSE_CURLY_BRACE_TOKEN
      ) {
        this.match(SyntaxKind.END_OF_STATEMENT_TOKEN);
      }
      statements.push(statement);
    }
    let close_curly_brace = this.match(SyntaxKind.CLOSE_CURLY_BRACE_TOKEN);
    return new BlockStatementSyntax(
      open_curly_brace,
      statements,
      close_curly_brace
    );
  }

  parseIfStatement(): StatementSyntax {
    let ifToken = this.match(SyntaxKind.IF_TOKEN);
    let open_parenthesis = this.match(SyntaxKind.OPEN_BRACKET_TOKEN);
    let condition = this.parseStatement();
    let close_parenthesis = this.match(SyntaxKind.CLOSE_BRACKET_TOKEN);
    let block = this.parseBlockStatement();
    return new IfStatementSyntax(
      ifToken,
      open_parenthesis,
      condition,
      block,
      close_parenthesis
    );
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

  parseNameExpression() {
    let identifierToken = this.nextToken();
    return new NameExpressionSyntax(identifierToken);
  }

  parseArguments() {
    let nodes = [];
    while (
      this.currentToken.kind !== SyntaxKind.CLOSE_BRACKET_TOKEN &&
      this.currentToken.kind !== SyntaxKind.END_OF_FILE_TOKEN
    ) {
      let argument = this.parseBinaryExpression();
      nodes.push(argument);
      if ((this.currentToken.kind as any) !== SyntaxKind.CLOSE_BRACKET_TOKEN) {
        let comma = this.match(SyntaxKind.COMMA_TOKEN);
        nodes.push(comma);
      }
    }
    return new SeperatedSyntaxList(nodes);
  }

  parseCallExpression() {
    let identifier = this.match(SyntaxKind.IDENTIFIER_TOKEN);
    let open_parenthesis = this.match(SyntaxKind.OPEN_BRACKET_TOKEN);
    let callArguments = this.parseArguments();
    let closeParenthesis = this.match(SyntaxKind.CLOSE_BRACKET_TOKEN);
    return new CallExpressionSyntax(
      identifier,
      open_parenthesis,
      callArguments,
      closeParenthesis
    );
  }

  parseNameOrCallExpression(): ExpressionSyntax {
    if (this.peek(1).kind == SyntaxKind.OPEN_BRACKET_TOKEN) {
      return this.parseCallExpression();
    }
    return this.parseNameExpression();
  }

  parsePrimaryExpression(): ExpressionSyntax {
    switch (this.currentToken.kind) {
      case SyntaxKind.OPEN_BRACKET_TOKEN:
        var left = this.nextToken();
        var expression = this.parseStatement();
        var right = this.match(SyntaxKind.CLOSE_BRACKET_TOKEN);
        return new ParenthesizedExpressionSyntax(left, expression, right);
      case SyntaxKind.IDENTIFIER_TOKEN:
        return this.parseNameOrCallExpression();
      default:
        let numberToken = this.match(SyntaxKind.LITERAL_TOKEN);
        return new LiteralExpressionSyntax(numberToken);
    }
  }
}
