import { Token } from '.';
import { TokenKind } from '../../Typings';

export default class LiteralToken extends Token {
  kind = TokenKind.LITERAL_TOKEN;
  constructor(
    readonly start: number,
    readonly end: number,
    readonly value: number
  ) {
    super();
  }

  toString(): string {
    return `LiteralToken("${this.value}")`;
  }
}
