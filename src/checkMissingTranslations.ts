import { getEmptyStringKeysOfObject } from './getEmptyStringKeysOfObject';
import { readJsonFile } from './translateEmptyTranslations';

export const checkMissingTranslations = async ({
  localesToTranslate,
  lintOutputDir,
}: {
  localesToTranslate: string[];
  lintOutputDir: string;
}) => {
  for (const localeName of localesToTranslate) {
    const localeObj = await readJsonFile(lintOutputDir, localeName);

    const emptyStringsKeys = getEmptyStringKeysOfObject(localeObj);

    if (emptyStringsKeys.length !== 0) throw new Error(`[error] missing translation key: "${emptyStringsKeys[0]}"`);
  }
};
