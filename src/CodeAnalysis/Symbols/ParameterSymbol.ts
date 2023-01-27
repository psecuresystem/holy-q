import Types from '../Binding/Types';
import Symbol from './Symbol';
import SymbolKind from './SymbolKind';

export default class ParameterSymbol extends Symbol {
  kind = SymbolKind.Parameter;
  constructor(readonly name: string, readonly type: Types) {
    super(name);
  }
}
