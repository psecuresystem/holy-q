import Types from './Binding/Types';

export default class VariableSymbol {
  constructor(
    readonly name: string,
    readonly type: Types,
    readonly mutable: boolean
  ) {}
}
