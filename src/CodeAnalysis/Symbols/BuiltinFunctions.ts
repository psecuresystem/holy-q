import Types from '../Binding/Types';
import FunctionSymbol from './FunctionSymbol';
import ParameterSymbol from './ParameterSymbol';

const BuiltInFunctions = {
  X: new FunctionSymbol(
    'X',
    [new ParameterSymbol('qubit', Types.Qubit)],
    Types.Qubit
  ),
  Y: new FunctionSymbol(
    'Y',
    [new ParameterSymbol('qubit', Types.Qubit)],
    Types.Qubit
  ),
  Z: new FunctionSymbol(
    'Z',
    [new ParameterSymbol('qubit', Types.Qubit)],
    Types.Qubit
  ),
  H: new FunctionSymbol(
    'H',
    [new ParameterSymbol('qubit', Types.Qubit)],
    Types.Qubit
  ),
  Q: new FunctionSymbol(
    'Q',
    [new ParameterSymbol('number', Types.Number)],
    Types.Qubit
  ),
};

export default BuiltInFunctions;
