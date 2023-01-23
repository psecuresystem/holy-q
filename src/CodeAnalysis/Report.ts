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

  reportInvalidTypeSetting() {
    this._diagnostics.push(
      new TypeMismatchError(
        'Type Mismatch Error',
        'On X Line, you attempted to re assign a variable but the type you tried to re assign it to was different',
        [-1, -1],
        [-1, -1]
      )
    );
  }

  reportAttemptedImmutableReassignment() {
    this._diagnostics.push(
      new TypeMismatchError(
        'Type Mismatch Error',
        'You tried re assigning to an immutable variable',
        [-1, -1],
        [-1, -1]
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

  reportUndefinedName(name: string) {
    this._diagnostics.push(
      new SyntaxError(
        'Unknown Variable',
        `Unknown Name ${name} Found At Position`,
        [-1, -1],
        [-1, -1]
      )
    );
  }
}
