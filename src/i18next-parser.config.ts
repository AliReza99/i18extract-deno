import type { UserConfig } from 'i18next-parser';

const config: UserConfig = {
  contextSeparator: '_',
  // Key separator used in your translation keys

  createOldCatalogs: false,
  // Save the \_old files

  defaultNamespace: 'translation',
  // Default namespace used in your i18next config

  defaultValue: (locale: string | undefined, namespace: string | undefined, key: string | undefined) => {
    //TODO: // if (locale === defaultLocale.name) {
    if (locale === 'en') {
      return key || '';
    }

    return '';
  },
  // Default value to give to keys with no value
  // You may also specify a function accepting the locale, namespace, key, and value as arguments

  indentation: 2,
  // Indentation of the catalog files

  keepRemoved: false,
  // Keep keys from the catalog that are no longer in code
  // You may either specify a boolean to keep or discard all removed keys.
  // You may also specify an array of patterns: the keys from the catalog that are no long in the code but match one of the patterns will be kept.
  // The patterns are applied to the full key including the namespace, the parent keys and the separators.

  keySeparator: false,
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  // see below for more details
  lexers: {
    hbs: ['HandlebarsLexer'],
    handlebars: ['HandlebarsLexer'],

    htm: ['HTMLLexer'],
    html: ['HTMLLexer'],

    mjs: ['JavascriptLexer'],
    js: ['JsxLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],

    default: ['JavascriptLexer'],
  },

  lineEnding: 'auto',
  // Control the line ending. See options at https://github.com/ryanve/eol

  //TODO: // locales: Object.keys(locales),
  locales: ['en', 'es', 'ca'],
  // An array of the locales in your applications

  namespaceSeparator: ':',
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.

  // output: 'locales/$LOCALE/$NAMESPACE.json',
  output: '___OUTPUT___',
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()

  pluralSeparator: '_',
  // Plural separator used in your translation keys
  // If you want to use plain english keys, separators such as `_` might conflict. You might want to set `pluralSeparator` to a different string that does not occur in your keys.
  // If you don't want to generate keys for plurals (for example, in case you are using ICU format), set `pluralSeparator: false`.

  input: '___INPUT___',
  // An array of globs that describe where to look for source files
  // relative to the location of the configuration file

  sort: true,
  // Whether or not to sort the catalog. Can also be a [compareFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters)

  verbose: false,
  // Display info about the parsing including some stats

  failOnWarnings: false,
  // Exit with an exit code of 1 on warnings

  failOnUpdate: false,
  // Exit with an exit code of 1 when translations are updated (for CI purpose)

  customValueTemplate: null,
  // If you wish to customize the value output the value as an object, you can set your own format.
  // ${defaultValue} is the default value you set in your translation function.
  // Any other custom property will be automatically extracted.
  //
  // Example:
  // {
  //   message: "${defaultValue}",
  //   description: "${maxLength}", // t('my-key', {maxLength: 150})
  // }

  resetDefaultValueLocale: null,
  // The locale to compare with default values to determine whether a default value has been changed.
  // If this is set and a default value differs from a translation in the specified locale, all entries
  // for that key across locales are reset to the default value, and existing translations are moved to
  // the `_old` file.

  i18nextOptions: null,
  // If you wish to customize options in internally used i18next instance, you can define an object with any
  // configuration property supported by i18next (https://www.i18next.com/overview/configuration-options).
  // { compatibilityJSON: 'v3' } can be used to generate v3 compatible plurals.

  yamlOptions: null,
  // If you wish to customize options for yaml output, you can define an object here.
  // Configuration options are here (https://github.com/nodeca/js-yaml#dump-object---options-).
  // Example:
  // {
  //   lineWidth: -1,
  // }
};

export default config;
