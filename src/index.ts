import * as fs from 'fs';
import Binder from './CodeAnalysis/Binding/Binder';
import Evaluator from './CodeAnalysis/Evaluator';
import Reporter from './CodeAnalysis/Report';
import SyntaxTree from './CodeAnalysis/Syntax/SyntaxTree';

export const reporter = new Reporter();
function main(entryPoint: string) {
  fs.readFile(entryPoint, 'utf8', (err, data) => {
    if (err) throw new Error(err.message);
    const tree = SyntaxTree.parse(data);
    const binder = new Binder();
    const boundExp = binder.bindExpression(tree.root);
    const evaluator = new Evaluator(boundExp);
    console.log(tree.root);
    console.log(evaluator.evaluate());
    reporter.showErrors();
  });
}

main('./samples/expression.hq');
