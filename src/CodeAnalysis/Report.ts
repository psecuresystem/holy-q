import Error from './Errors/Error';
import SyntaxError from './Errors/SyntaxError';
import TypeMismatchError from './Errors/TypeMismatchError';

export default class Reporter {
  private readonly _diagnostics: Error[] = [];
  reportInvalidToken(position: {
    start: [number, number];
    end: [number, number];
  }) {
    this._diagnostics.push(
      new SyntaxError(
        'Invalid token',
        `Invalid Token found at position`,
        position.start,
        position.end
      )
    );
  }

  reportUnexpectedSyntax(message: string) {
    this._diagnostics.push(
      new SyntaxError('Unexpected Syntax', message, [-1, -1], [-1, -1])
    );
  }

  reportTypeMismatchError(message: string) {
    this._diagnostics.push(
      new TypeMismatchError('Type Mismatch Error', message, [-1, -1], [-1, -1])
    );
  }

  showErrors() {
    for (const error of this._diagnostics) {
      console.log(
        '\x1b[31m',
        `
${error.type}:
  ${error.name}
  ${error.message}
      `
      );
    }
  }
}
