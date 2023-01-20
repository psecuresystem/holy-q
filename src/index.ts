import * as fs from 'fs';
import Lexer from './Syntax/lexer';

function main(entryPoint: string) {
  fs.readFile(entryPoint, 'utf8', (err, data) => {
    if (err) throw new Error(err.message);
    const lexer = new Lexer(data);
    const tokens = lexer.lex();
    console.log(tokens);
  });
}

main('./samples/expression.hq');
