import { getEmptyStringKeysOfObject } from './getEmptyStringKeysOfObject';
import _ from 'lodash';
import { translate } from '@vitalets/google-translate-api';
import { to } from 'await-to-js';
import path from 'path';
import fse from 'fs-extra';

export async function readJsonFile(outputDir: string, localeName: string) {
  const filePath = path.join(outputDir, `${localeName}.json`);
  const jsonData = await fse.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

const setTranslations = async (outputDir: string, localeName: string, obj: Record<string, unknown>) =>
  fse.outputFileSync(path.join(outputDir, `${localeName}.json`), JSON.stringify(obj, null, 2));

export const translateLocalesFiles = async ({
  outputDir,
  defaultLocale,
  localesToTranslate,
}: {
  outputDir: string;
  defaultLocale: string;
  localesToTranslate: string[];
}) => {
  let defaultLocaleTranslations = await readJsonFile(outputDir, defaultLocale);

  for (const localeName of localesToTranslate) {
    const localeObj = await readJsonFile(outputDir, localeName);

    const emptyStringsKeys = getEmptyStringKeysOfObject(localeObj);

    if (!emptyStringsKeys.length) continue;

    console.log(`\nTranslating ${localeName}:`);

    for (let key of emptyStringsKeys) {
      const enValue = _.get(defaultLocaleTranslations, key);

      const [err, res] = await to(translate(enValue, { to: localeName }));

      if (err) {
        await setTranslations(outputDir, localeName, localeObj);
        throw err;
      }
      const translatedValue = res.text;
      console.log(`"${enValue}" => "${translatedValue}"`);

      _.set(localeObj, key, translatedValue);
    }
    await setTranslations(outputDir, localeName, localeObj);
  }

  console.log(`\nTranslations added`);
};
