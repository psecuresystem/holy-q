import { operators, SyntaxKind } from '../Typings';
import { isNumber, isOperator } from '../Utils/isX';
import Token from './Token';

export default class Lexer {
  pointer: number = 0;
  constructor(public readonly inputText: string) {}

  get current() {
    return this.inputText[this.pointer];
  }

  peek(range: number) {
    return this.inputText[this.pointer + range];
  }

  lex(): Token[] {
    const tokens = [];

    while (this.pointer < this.inputText.length) {
      let value = '';
      let kind: SyntaxKind = SyntaxKind.UNDEFINED_TOKEN;
      const start = this.pointer;
      switch (this.current) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
          while (
            this.pointer <= this.inputText.length &&
            isNumber(this.current)
          ) {
            value += this.current;
            this.pointer++;
          }
          kind = SyntaxKind.LITERAL_TOKEN;
          break;
        case ' ':
          while (this.pointer <= this.inputText.length && this.current == ' ') {
            value += ' ';
            this.pointer++;
          }
          kind = SyntaxKind.WHITESPACE_TOKEN;
          break;
        case '+':
          value += '+';
          this.pointer++;
          kind = SyntaxKind.PLUS_TOKEN;
          break;
        case '-':
          value += '-';
          this.pointer++;
          kind = SyntaxKind.MINUS_TOKEN;
          break;
        case '/':
          value += '/';
          this.pointer++;
          kind = SyntaxKind.SLASH_TOKEN;
          break;
        case '*':
          value += '*';
          this.pointer++;
          kind = SyntaxKind.STAR_TOKEN;
          break;
        case '|':
          if (this.peek(1) == '|') {
            value += '||';
            this.pointer += 2;
            kind = SyntaxKind.PIPE_PIPE_TOKEN;
          } else {
            value += '|';
            this.pointer += 1;
            kind = SyntaxKind.PIPE_TOKEN;
          }
          break;
        case '&':
          if (this.peek(1) == '&') {
            value += '&&';
            this.pointer += 2;
            kind = SyntaxKind.AMPERSAND_AMPERSAND_TOKEN;
          } else {
            value += '&';
            this.pointer += 1;
            kind = SyntaxKind.AMPERSAND_TOKEN;
          }
          break;
        case '!':
          if (this.peek(1) == '=') {
            value += '!=';
            this.pointer += 2;
            kind = SyntaxKind.BANG_EQUALS_TOKEN;
          }
          break;
        case '=':
          if (this.peek(1) == '=') {
            value += '==';
            this.pointer += 2;
            kind = SyntaxKind.EQUALS_EQUALS_TOKEN;
          }
          break;
        default:
          console.error(
            `%c Undefined Token ${this.current} Found at Position ${this.pointer}`,
            'color: #ff0000'
          );
          this.pointer++;
      }
      tokens.push(new Token(start, value, kind));
    }
    tokens.push(new Token(this.pointer, '\0', SyntaxKind.END_OF_FILE_TOKEN));
    return tokens;
  }
}
