import Error from './Error';

export default class TypeMismatchError extends Error {
  constructor(
    readonly name: string,
    readonly message: string,
    readonly start: [number, number],
    readonly end: [number, number]
  ) {
    super('Type Mismatch Error', name, message, start, end);
  }
}
