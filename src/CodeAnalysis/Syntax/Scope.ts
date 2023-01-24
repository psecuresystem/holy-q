import BoundExpression from '../Binding/BoundExpression';
import Types from '../Binding/Types';
import VariableSymbol from '../VariableSymbol';

export default class Scope {
  private _variables: Map<VariableSymbol, any> = new Map();
  constructor(readonly parent?: Scope) {}

  get variables(): typeof this._variables {
    let combinedMap = new Map<VariableSymbol, any>();

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

  setVariable(variable: VariableSymbol, value?: BoundExpression) {
    this._variables.set(variable, value);
  }

  getVariable(variableName: string) {
    let variable: BoundExpression;
    this.variables.forEach((value, key) => {
      if (key.name == variableName) {
        variable = value;
      }
    });
    return variable!;
  }
}
