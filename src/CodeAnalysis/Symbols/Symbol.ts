import SymbolKind from './SymbolKind';

export default abstract class Symbol {
  abstract kind: SymbolKind;
  constructor(readonly name: string) {}

  toString() {
    return this.name;
  }
}
