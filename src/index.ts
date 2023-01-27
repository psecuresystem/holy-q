import * as fs from 'fs';
import Binder from './CodeAnalysis/Binding/Binder';
import Evaluator from './CodeAnalysis/Evaluator';
import Reporter from './CodeAnalysis/Report';
import BuiltInFunctions from './CodeAnalysis/Symbols/BuiltinFunctions';
import GlobalScopeSyntax from './CodeAnalysis/Syntax/GlobalScopeSyntax';
import IfExpressionSyntax from './CodeAnalysis/Syntax/IfStatementSyntax';
import Scope from './CodeAnalysis/Syntax/Scope';
import SyntaxTree from './CodeAnalysis/Syntax/SyntaxTree';

export const reporter = new Reporter();
function main(entryPoint: string, showTree = false) {
  fs.readFile(entryPoint, 'utf8', (err, data) => {
    if (err) throw new Error(err.message);
    const tree = SyntaxTree.parse(data);
    const globalScope = new Scope();
    for (const func of Object.values(BuiltInFunctions)) {
      globalScope.setFunction(func);
    }
    const binder = new Binder(globalScope);
    const boundExp = binder.bindGlobalScopeExpression(
      tree.root as GlobalScopeSyntax
    );
    const evaluator = new Evaluator(boundExp);
    showTree && console.log(boundExp);
    let result = evaluator.evaluate();
    console.log(`Result: ${result}`);
    reporter.showErrors();
  });
}

main('./samples/expression.hq');
