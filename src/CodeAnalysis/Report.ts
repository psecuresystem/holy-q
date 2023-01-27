import Types from './Binding/Types';
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

  reportWrongArgumentsCount(name: string, current: number, expected: number) {
    this._diagnostics.push(
      new SyntaxError(
        'Wrong Argument Count',
        `You provided ${current} arguments for function ${name} while it expected ${expected} arguments`,
        [-1, -1],
        [-1, -1]
      )
    );
  }

  reportUndefinedFunction(name: string) {
    this._diagnostics.push(
      new SyntaxError(
        'Unknown Function',
        `You attempted to call function ${name} but it cant be found`,
        [-1, -1],
        [-1, -1]
      )
    );
  }

  reportInvalidIfStatementCondition(type: string) {
    this._diagnostics.push(
      new SyntaxError(
        'Invalid Condition',
        `The If Statement condition at line x is invalid. Expected type boolean got ${type}`,
        [-1, -1],
        [-1, -1]
      )
    );
  }

  reportInvalidParameterType(
    functionName: string,
    current: Types,
    target: Types
  ) {
    this._diagnostics.push(
      new SyntaxError(
        'Invalid Parameter',
        `
When calling ${functionName}, the parameter of type ${target} was expected. Got type ${current}
      `,
        [-1, -1],
        [-1, -1]
      )
    );
  }
}
