import { TokenKind } from '../../Typings';

export default abstract class Token {
  abstract start: number;
  abstract end: number;
  abstract value: unknown;
  abstract kind: TokenKind;
}
