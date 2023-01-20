import { Token } from '.';
import { TokenKind } from '../../Typings';

export default class WhiteSpaceToken extends Token {
  kind = TokenKind.WHITESPACE_TOKEN;
  constructor(
    readonly start: number,
    readonly end: number,
    readonly value: string
  ) {
    super();
  }

  toString(): string {
    return `WhiteSpaceToken("${this.value}")`;
  }
}
