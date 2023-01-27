import Types from '../Binding/Types';
import ParameterSymbol from './ParameterSymbol';
import Symbol from './Symbol';
import SymbolKind from './SymbolKind';

export default class FunctionSymbol extends Symbol {
  kind = SymbolKind.Function;
  constructor(
    readonly name: string,
    readonly parameters: ParameterSymbol[],
    readonly type: Types
  ) {
    super(name);
  }
}
