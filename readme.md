# fork of [i18extract](https://github.com/AliReza99/i18extract) to be compatible with deno

A command-line tool for extracting i18next translation keys from your source code and generating translation JSON files using Google Translate APIs.

## Badges

![npm](https://img.shields.io/npm/v/i18extract) ![npm](https://img.shields.io/npm/dt/i18extract)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Parameters](#parameters)
- [Examples](#examples)
- [License](#license)

## Installation

You can use `i18extract` directly via npx:

```bash
npx i18extract
```

## Usage

To extract translation keys and generate translation files, use the following command:

```bash
npx i18extract -l en,es,fr -i src/**/*.{js,jsx,ts,tsx} -o locales
```

## Parameters

- `-l` (required): List of languages to create translations for (separated by commas, e.g., `en,ca,es`).
- `-i` (required): Input path to search for translation keys (glob patterns can be used).
- `-o` (required): Output directory where translation JSON files will be generated.
- `--lint` (optional): Checks if every translation key exists in the translation JSON files.

## Examples

1. **Basic Usage**:

   ```bash
   npx i18extract -l en,es,fr -i src/**/*.{js,jsx,ts,tsx} -o locales
   ```

   This command searches the `src` folder for translation keys (e.g., `t('Hi')`) and generates:

   - `locales/en.json`
     ```json
     { "Hi": "Hi" }
     ```
   - `locales/es.json`
     ```json
     { "Hi": "Hola" }
     ```
   - `locales/fr.json`
     ```json
     { "Hi": "Salut" }
     ```

2. **Using the Linter**:
   ```bash
   npx i18extract -l en,es,fr -i src/**/*.{js,jsx,ts,tsx} -o locales --lint
   ```
   This command will check for missing translations:
   ```
   >> error: no translation found for "Hi"
   ```

## License

[MIT License](LICENSE)

```
Feel free to let me know if you want to add or modify any sections!
```
