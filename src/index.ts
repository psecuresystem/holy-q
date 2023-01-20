import * as fs from 'fs';

function main(entryPoint: string) {
  fs.readFile(entryPoint, 'utf8', (err, data) => {
    if (err) throw new Error(err.message);
    if (data == '1 + 1') {
      console.log(2);
    } else {
      console.error('Invalid Syntax');
    }
  });
}

main('./samples/expression.hq');
