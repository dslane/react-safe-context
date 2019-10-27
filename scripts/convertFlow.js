import { compiler, beautify } from 'flowgen';
import fs from 'fs';
import path from 'path';

const distFolder = path.join('.', 'dist');
fs.readdir(distFolder, async (err, files) => {
  if (err) {
    console.error('Could not list the directory.', err);
    process.exit(1);
  }

  const writePromises = [];
  files.forEach(file => {
    const matches = file.match(/(.*)\.d\.ts$/);
    if (matches) {
      writePromises.push(
        fs.writeFile(
          path.join(distFolder, `${matches[1]}.js.flow`),
          beautify(compiler.compileDefinitionFile(path.join(distFolder, file))),
          () => {},
        ),
      );
    }
  });

  await Promise.all(writePromises);
});
