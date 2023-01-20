import { Token } from '.';
import { operators, TokenKind } from '../../Typings';

export default class OperatorToken extends Token {
  kind = TokenKind.OPERATOR_TOKEN;
  constructor(
    readonly start: number,
    readonly end: number,
    readonly value: operators
  ) {
    super();
  }

  toString(): string {
    return `OperatorToken("${this.value}")`;
  }
}
