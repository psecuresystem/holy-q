import * as fs from 'fs';
import Binder from './CodeAnalysis/Binding/Binder';
import Evaluator from './CodeAnalysis/Evaluator';
import Reporter from './CodeAnalysis/Report';
import GlobalScopeSyntax from './CodeAnalysis/Syntax/GlobalScopeSyntax';
import Scope from './CodeAnalysis/Syntax/Scope';
import SyntaxTree from './CodeAnalysis/Syntax/SyntaxTree';

export const reporter = new Reporter();
function main(entryPoint: string, showTree = false) {
  fs.readFile(entryPoint, 'utf8', (err, data) => {
    if (err) throw new Error(err.message);
    const tree = SyntaxTree.parse(data);
    const globalScope = new Scope();
    const binder = new Binder(globalScope);
    const boundExp = binder.bindExpression(tree.root);
    const evaluator = new Evaluator(boundExp, globalScope);
    showTree && console.log((tree.root as GlobalScopeSyntax).expressions);
    evaluator.evaluate();
    reporter.showErrors();
  });
}

main('./samples/expression.hq');
