# pv-porcupine-optimizer

![Language](https://img.shields.io/badge/language-TypeScript-blue.svg)
![Node Version](https://img.shields.io/badge/node-v.10.15.0-blue.svg)
![Yarn Version](https://img.shields.io/badge/yarn-v1.12.3-yellow.svg)
![Licence Info](https://img.shields.io/badge/license-MIT-brightgreen.svg)

Typescript first nodejs wrapper for Picovoice Porcupine Optimizer tool

* 🎉 First class Typescript support
* ☁️ Latest stable binary version downloaded on install
* 👌 Simple and clean API


## Table of Contents

- [Installation](#installation)
- [API](#api)
- [Example](#example)
- [Support](#support)
- [Contributing](#contributing)
- [Licence](#licence)
- [Author](#author)

## Installation

```bash
$ npm install --save pv-porcupine-optimizer

...
```
```bash
$ yarn add pv-porcupine-optimizer

...
```

## API

This module exports an `Optimizer` class with a single async method `createWakeWord(phrase: string)` returning
a promise of `OptimizerResult` (which is a union type).

```ts
export declare class Optimizer {
    constructor();
    createWakeWord(phrase: string): Promise<OptimizerResult>;
}
```

This return type is structured differently depending on the success of the wake word creation. 

- **Success case**: `path` contains the path of the newly created keyword file.
- **Failure case**: `errors` contains an array of human readable errors, with tips on how to progress.

```ts
export declare type OptimizerResult = {
    success: true;
    path: string;
} | {
    success: false;
    errors: string[];
};
```

## Example

```ts
import { Optimizer } from "pv-porcupine-optimizer";

const optimizer = new Optimizer();

const result = await optimizer.createWakeWord("Alexa");

if (result.success) {
    console.log(`path: ${result.path}`);
} else {
    console.log(`errors: ${result.errors}`);
}
```

## Support

Please [open an issue](https://github.com/jarvisprestidge/pv-porcupine-optimizer/issues/new) for support.

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/jarvisprestidge/pv-porcupine-optimizer/compare/).

## License

**MIT** - http://opensource.org/licenses/MIT

## Author

**Jarvis Prestidge** - <jarvisprestidge@gmail.com>

