// import * as fs from 'fs';
// import Binder from './CodeAnalysis/Binding/Binder';
// import Evaluator from './CodeAnalysis/Evaluator';
// import Reporter from './CodeAnalysis/Report';
// import BinaryExpressionSyntax from './CodeAnalysis/Syntax/BinaryExpressionSyntax';
// import GlobalScopeSyntax from './CodeAnalysis/Syntax/GlobalScopeSyntax';
// import SyntaxTree from './CodeAnalysis/Syntax/SyntaxTree';

import ComplexNumber from './QuantumComputing/Math/ComplexNumber';
import Matrix from './QuantumComputing/Math/Matrix';
import RealNumber from './QuantumComputing/Math/RealNumber';
import Vector from './QuantumComputing/Math/Vector';
import Qubit from './QuantumComputing/Qubit';

// export const reporter = new Reporter();
// function main(entryPoint: string, showTree = false) {
//   fs.readFile(entryPoint, 'utf8', (err, data) => {
//     if (err) throw new Error(err.message);
//     const tree = SyntaxTree.parse(data);
//     const binder = new Binder();
//     const boundExp = binder.bindExpression(tree.root);
//     const evaluator = new Evaluator(boundExp);
//     showTree && console.log((tree.root as GlobalScopeSyntax).expressions);
//     evaluator.evaluate();
//     reporter.showErrors();
//   });
// }

// main('./samples/expression.hq');

function main() {
  let qubit1 = Qubit.fromBit(1);
  let x = new Matrix(
    [
      [
        ComplexNumber.fromInt(new RealNumber(0)),
        ComplexNumber.fromInt(new RealNumber(1)),
      ],
      [
        ComplexNumber.fromInt(new RealNumber(1)),
        ComplexNumber.fromInt(new RealNumber(0)),
      ],
    ],
    [2, 2]
  );
  let y = new Matrix(
    [
      [
        ComplexNumber.fromInt(new RealNumber(0)),
        new ComplexNumber(
          new Vector([
            RealNumber.fromEmpty(),
            new RealNumber(-1),
            RealNumber.fromEmpty(),
            RealNumber.fromEmpty(),
          ])
        ),
      ],
      [
        new ComplexNumber(
          new Vector([
            RealNumber.fromEmpty(),
            new RealNumber(-1),
            RealNumber.fromEmpty(),
            RealNumber.fromEmpty(),
          ])
        ),
        ComplexNumber.fromInt(new RealNumber(0)),
      ],
    ],
    [2, 2]
  );
  let z = new Matrix(
    [
      [
        ComplexNumber.fromInt(new RealNumber(1)),
        ComplexNumber.fromInt(new RealNumber(0)),
      ],
      [
        ComplexNumber.fromInt(new RealNumber(0)),
        ComplexNumber.fromInt(new RealNumber(-1)),
      ],
    ],
    [2, 2]
  );
  console.log(
    'qubit1.state',
    qubit1.state.allItems.map((el) => `${el}`)
  );
  qubit1 = qubit1.apply(z);
  console.log(
    'qubit1.state',
    qubit1.state.allItems.map((el) => `${el}`)
  );
}

main();
