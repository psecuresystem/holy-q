// import * as fs from 'fs';
// import Binder from './CodeAnalysis/Binding/Binder';
// import Evaluator from './CodeAnalysis/Evaluator';
// import Reporter from './CodeAnalysis/Report';
// import BinaryExpressionSyntax from './CodeAnalysis/Syntax/BinaryExpressionSyntax';
// import GlobalScopeSyntax from './CodeAnalysis/Syntax/GlobalScopeSyntax';
// import SyntaxTree from './CodeAnalysis/Syntax/SyntaxTree';

import Scalar from './QuantumComputing/Math/Scalar';
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
  const sca1 = Scalar.fromInt(10);
  const sca2 = Scalar.fromInt(4);
  const sca3 = Scalar.fromInt(5);
  console.log(`${sca1.multiply(sca2).multiply(sca3)}`);
}

main();
