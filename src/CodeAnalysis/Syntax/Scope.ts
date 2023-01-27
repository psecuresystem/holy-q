import BoundExpression from '../Binding/BoundExpression';
import Types from '../Binding/Types';
import FunctionSymbol from '../Symbols/FunctionSymbol';
import VariableSymbol from '../Symbols/VariableSymbol';

export default class Scope {
  private _variables: Map<string, VariableSymbol> = new Map();
  private _functions: Map<string, FunctionSymbol> = new Map();
  constructor(readonly parent?: Scope) {}

  get variables(): typeof this._variables {
    let combinedMap = new Map<string, VariableSymbol>();

    if (this.parent) {
      this.parent.variables.forEach((value, key) => {
        combinedMap.set(key, value);
      });
    }

    this._variables.forEach((value, key) => {
      combinedMap.set(key, value);
    });

    return combinedMap;
  }

  get functions(): typeof this._functions {
    let combinedMap = new Map<string, FunctionSymbol>();

    if (this.parent) {
      this.parent.functions.forEach((value, key) => {
        combinedMap.set(key, value);
      });
    }

    this._functions.forEach((value, key) => {
      combinedMap.set(key, value);
    });

    return combinedMap;
  }

  setVariable(variable: VariableSymbol) {
    this._variables.set(variable.name, variable);
  }

  createVariable(variable: VariableSymbol) {
    if (this._variables.has(variable.name)) {
      throw new Error(`
Fatal Error:
  Bad Attempt to redeclare variable in current scope. variable ${variable.name} is already declared
`);
    }
    this._variables.set(variable.name, variable);
  }

  getVariable(variableName: string) {
    return this.variables.get(variableName);
  }

  getFunction(functionName: string) {
    return this.functions.get(functionName);
  }

  setFunction(functionName: FunctionSymbol) {
    if (this._functions.has(functionName.name)) {
      return false;
    }
    this._functions.set(functionName.name, functionName);
  }
}
