// import * as fs from 'fs';
// import Binder from './CodeAnalysis/Binding/Binder';
// import Evaluator from './CodeAnalysis/Evaluator';
// import Reporter from './CodeAnalysis/Report';
// import BinaryExpressionSyntax from './CodeAnalysis/Syntax/BinaryExpressionSyntax';
// import GlobalScopeSyntax from './CodeAnalysis/Syntax/GlobalScopeSyntax';
// import SyntaxTree from './CodeAnalysis/Syntax/SyntaxTree';

import ComplexNumber from './QuantumComputing/Math/ComplexNumber';
import RealNumber from './QuantumComputing/Math/RealNumber';
import Vector from './QuantumComputing/Math/Vector';

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
  const sca1 = new ComplexNumber(
    new Vector([
      new RealNumber(1),
      new RealNumber(2, 5),
      new RealNumber(0),
      new RealNumber(0),
    ])
  );
  const sca2 = ComplexNumber.fromInt(new RealNumber(4));
  const sca3 = new ComplexNumber(
    new Vector([
      new RealNumber(3),
      new RealNumber(9),
      new RealNumber(7, 2),
      new RealNumber(0),
    ])
  );
  console.log('sca1.multiply(sca2)', `${sca1.multiply(sca2).multiply(sca3)}`);
}

main();
