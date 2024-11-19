#!/usr/bin/env node

import { Command } from 'commander';
import { execute } from '@arbz/execute';
import fse from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { translateLocalesFiles } from './translateEmptyTranslations';
import { checkMissingTranslations } from './checkMissingTranslations';
import { to } from 'await-to-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentDir = process.cwd();

let configFileCreated = false;

function cleanup() {
  if (!configFileCreated) return;
  fse.removeSync(`${currentDir}/i18next-parser.config.js`);
}

const program = new Command();

function getCliOptions() {
  program
    .requiredOption(
      '-l, --locales <input>',
      "locales separated by comma (first one will be default and won't be translated) like: en,es,fr",
    )
    .option('--lint', 'Run the linter')
    .requiredOption('-i, --input <input>', 'input glob like: src/**/*.{js,jsx,ts,tsx}')
    .requiredOption('-o, --output <input>', 'locales output directory like: src/locales')
    .parse(process.argv);

  return program.opts<{
    locales: string;
    output: string;
    input: string;
    lint?: boolean;
  }>();
}

function ensurei18nextParserConfigNotExist() {
  const haveConfig =
    fse.pathExistsSync(path.resolve(currentDir, 'i18next-parser.config.ts')) ||
    fse.pathExistsSync(path.resolve(currentDir, 'i18next-parser.config.js'));

  if (haveConfig) {
    throw new Error(
      `existing i18next-parser config found which will be overwritten. remove and run the command again. exiting...`,
    );
  }
}

function generateConfigFileContent({
  outputDir,
  input,
  defaultLocale,
  locales,
}: {
  outputDir: string;
  input: string;
  defaultLocale: string;
  locales: string[];
}) {
  const i18parserOutput = `${outputDir}/$LOCALE.json`;
  const fallbackConfigFilePath = path.resolve(__dirname, 'i18next-parser.config.js');

  return fse
    .readFileSync(fallbackConfigFilePath, 'utf-8')
    .replace('___OUTPUT___', i18parserOutput)
    .replace('___INPUT___', input)
    .replace('___DEFAULT_LOCALE___', defaultLocale)
    .replace('___LOCALES___', JSON.stringify(locales));
}

async function main() {
  const options = getCliOptions();

  const locales = options.locales.split(',');
  const defaultLocale = locales[0];
  const localesOutputDir = path.resolve(options.output);

  ensurei18nextParserConfigNotExist();

  const outputDir = options.lint ? `${currentDir}/node_modules/.tmp/i18linter` : options.output;

  const configFileContent = generateConfigFileContent({
    input: options.input,
    defaultLocale,
    outputDir,
    locales,
  });

  fse.outputFileSync(`${currentDir}/i18next-parser.config.js`, configFileContent);
  configFileCreated = true;

  const localesToTranslate = locales.filter(localeName => localeName !== defaultLocale);

  try {
    if (options.lint) {
      const lintOutputDir = outputDir;
      if (!fse.existsSync(lintOutputDir)) {
        fse.mkdirSync(lintOutputDir, { recursive: true });
      }

      for (const localeName of localesToTranslate) {
        const [err] = await to(
          fse.copyFile(
            path.join(options.output, `/${localeName}.json`),
            path.join(lintOutputDir, `/${localeName}.json`),
          ),
        );
        if (err) {
          console.log(`[error] no translations found for ${localeName}`);
          console.log('[info] run the command without "--lint" to add missing translations');
          throw err;
        }
      }

      await execute(`deno run -A npm:i18next-parser -s`);

      await checkMissingTranslations({
        localesToTranslate: localesToTranslate,
        lintOutputDir: lintOutputDir,
      });
    } else {
      await execute(`deno run -A npm:i18next-parser`);
      await translateLocalesFiles({
        outputDir: localesOutputDir,
        defaultLocale: defaultLocale,
        localesToTranslate: localesToTranslate,
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
    console.log('[info] run the command without "--lint" to add missing translations');
    process.exit(0);
  } finally {
    cleanup();
  }
}

function onExit() {
  cleanup();
  process.exit(0);
}

process.on('SIGINT', onExit);
process.on('SIGTERM', onExit);
process.on('exit', () => {
  cleanup();
});

main();
