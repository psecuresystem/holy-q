import Error from './Error';

export default class SyntaxError extends Error {
  constructor(
    readonly name: string,
    readonly message: string,
    readonly start: [number, number],
    readonly end: [number, number]
  ) {
    super('Syntax Error', name, message, start, end);
  }
}
