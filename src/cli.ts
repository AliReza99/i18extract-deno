#!/usr/bin/env node

import { Command } from 'commander';
import { execute } from '@arbz/execute';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { translateLocalesFiles } from './translateEmptyTranslations';
import { checkMissingTranslations } from './checkMissingTranslations';
import { to } from 'await-to-js';

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fallbackConfigFilePath = path.resolve(__dirname, 'i18next-parser.config.js');

const currentDir = process.cwd();

async function main() {
  program
    .requiredOption(
      '-l, --locales <input>',
      "locales seperated by comma (first one will be default and won't be translated) like: en,es,fr",
    )
    .option('--lint', 'Run the linter')
    .requiredOption('-i, --input <input>', 'input glob like: src/**/*.{js,jsx,ts,tsx}')
    .requiredOption('-o, --output <input>', 'locales output directory like: src/locales')
    .parse(process.argv);

  const options = program.opts<{
    locales: string;
    output: string;
    input: string;
    lint?: boolean;
  }>();

  const locales = options.locales.split(',');
  const defaultLocale = locales[0];
  const localesOutputDir = path.resolve(options.output);

  const haveConfig =
    fse.pathExistsSync(path.resolve(currentDir, 'i18next-parser.config.ts')) ||
    fse.pathExistsSync(path.resolve(currentDir, 'i18next-parser.config.js'));

  if (haveConfig) {
    console.log('existing i18next-parser config found. exiting...');
    return;
  }

  const outputDir = options.lint ? `${currentDir}/node_modules/.tmp/i18linter` : options.output;

  const i18parserOutput = `${outputDir}/$LOCALE.json`;

  let configFileContent = fse.readFileSync(fallbackConfigFilePath, 'utf-8');
  configFileContent = configFileContent.replace('___OUTPUT___', i18parserOutput);
  configFileContent = configFileContent.replace('___INPUT___', options.input);

  fse.outputFileSync(`${currentDir}/i18next-parser.config.js`, configFileContent);

  const localesToTranslate = locales.filter(localeName => localeName !== defaultLocale);

  if (options.lint) {
    const lintOutputDir = outputDir;
    if (!fse.existsSync(lintOutputDir)) {
      fse.mkdirSync(lintOutputDir, { recursive: true });
    }

    for (const localeName of localesToTranslate) {
      fse.copyFileSync(
        path.join(options.output, `/${localeName}.json`),
        path.join(lintOutputDir, `/${localeName}.json`),
      );
    }

    await execute(`npx i18next-parser -s`);
    fse.removeSync(`${currentDir}/i18next-parser.config.js`);

    const [err] = await to(
      checkMissingTranslations({
        localesToTranslate: localesToTranslate,
        lintOutputDir: lintOutputDir,
      }),
    );
    if (!err) return;
    console.error(err.message);
    console.log('[info] run the command without "--lint" to add missing translations');
    process.exit(1);
  } else {
    await execute(`npx i18next-parser`);
    fse.removeSync(`${currentDir}/i18next-parser.config.js`);
    await translateLocalesFiles({
      outputDir: localesOutputDir,
      defaultLocale: defaultLocale,
      localesToTranslate: localesToTranslate,
    });
  }
}

main();
