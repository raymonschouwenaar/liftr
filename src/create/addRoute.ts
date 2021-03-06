import { Utf8AsciiBinaryEncoding } from 'crypto';

const fs = require('fs');
const util = require('util');

export const addRoute = (newRouteName: string) => {
    const readFile = util.promisify(fs.readFile);
    const writeFile = util.promisify(fs.readFile);
    readFile(process.cwd() + '/src/routes/index.ts', 'utf8')
        .then((text: Utf8AsciiBinaryEncoding) => {
            const newtext = text;
            const position1 = text.indexOf(`
export const routes: AppRouter[] = [
`) + 38;
            const output = `
  {
    handler: ${newRouteName}Route,
    middleware: [],
    path: '/${newRouteName}',
  },`;

            const importStatement = `
import { ${newRouteName}Route } from '@routes/${newRouteName}.route'`;

            const newFileContent = [newtext.slice(0, position1), output, newtext.slice(position1)].join('');
            const position2 = newFileContent.indexOf("import { Router } from 'express';") + 33;
            const finalFile = [newFileContent.slice(0, position2),
                importStatement,
                newFileContent.slice(position2)].join('');
            return finalFile;
        })
        .then((content: string) => {
            const pathToNewFile = process.cwd() + '/src/routes/index.ts';
            fs.writeFile(pathToNewFile, content, (err: Error) => {
                if (err) throw err;
            });
        })
        .catch((err: Error) => {
            console.log('Unexpected Error', err);
        });
};
