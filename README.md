# UTranslate

A simple and lightweight Node.js translation utility designed to make translating text between languages easy and programmatic. Built in TypeScript.

## 🚀 Features

- Translate text between languages
- Promise-based API
- TypeScript support with typings
- Easy to integrate in Node.js projects

## 📦 Installation

Install from npm:

```bash
npm install utranslate
```


## Usage
Import the library in your project:

```ts
import Utranslate from "utranslate";
```

## Example
```js
async function example() {
  const translator = new Utranslate("en", "uz");
  const result = await translator.translate("Hello, world!");
  console.log(result);
}

example();
```

Replace from and to language codes with any valid ISO language codes (e.g., fr, de, uz).


## License
This project is licensed under the MIT License.