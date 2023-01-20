import { operators } from '../Typings';
import { isNumber, isOperator } from '../Utils/isX';
import { LiteralToken, OperatorToken, WhiteSpaceToken } from './Tokens';
import EndOfFileToken from './Tokens/EndOfFileToken';

export default class Lexer {
  pointer: number = 0;
  constructor(public readonly inputText: string) {}

  get current() {
    return this.inputText[this.pointer];
  }

  peek(range: number) {
    return this.inputText[this.pointer + range];
  }

  lex() {
    const tokens = [];
    while (this.pointer < this.inputText.length) {
      if (isNumber(this.current)) {
        let numeric_value = '';
        const start = this.pointer;
        while (
          this.pointer <= this.inputText.length &&
          isNumber(this.current)
        ) {
          numeric_value += this.current;
          this.pointer++;
        }
        tokens.push(
          new LiteralToken(start, start + numeric_value.length, +numeric_value)
        );
      } else if (this.current == ' ') {
        let value = '';
        const start = this.pointer;
        while (this.pointer <= this.inputText.length && this.current == ' ') {
          value += ' ';
          this.pointer++;
        }
        tokens.push(new WhiteSpaceToken(start, start + value.length, value));
      } else if (isOperator(this.current)) {
        tokens.push(
          new OperatorToken(
            this.pointer,
            this.pointer + 1,
            this.current as operators
          )
        );
        this.pointer++;
      } else {
        console.error(
          `%c Undefined Token ${this.current} Found at Position ${this.pointer}`,
          'color: #ff0000'
        );
        this.pointer++;
      }
    }
    tokens.push(new EndOfFileToken(this.pointer, this.pointer + 1));
    return tokens;
  }
}
