import { Token } from '.';
import { TokenKind } from '../../Typings';

export default class EndOfFileToken extends Token {
  kind = TokenKind.END_OF_FILE_TOKEN;
  constructor(
    readonly start: number,
    readonly end: number,
    readonly value = '\0'
  ) {
    super();
  }

  toString(): string {
    return `EndOfFileToken()`;
  }
}
