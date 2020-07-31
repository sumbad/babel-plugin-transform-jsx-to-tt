<div align="center">
  <a href="https://www.npmjs.com/package/babel-plugin-transform-jsx-to-tt">
    <img src="https://img.shields.io/npm/v/babel-plugin-transform-jsx-to-tt.svg?maxAge=86400" alt="Last npm Registry Version">
  </a>
  <a href="https://travis-ci.org/sumbad/babel-plugin-transform-jsx-to-tt?branch=master">
    <img src="https://travis-ci.org/sumbad/babel-plugin-transform-jsx-to-tt.svg?branch=master" alt="Build Status">
  </a>
  <a href="https://codecov.io/gh/sumbad/babel-plugin-transform-jsx-to-tt">
    <img src="https://codecov.io/gh/sumbad/babel-plugin-transform-jsx-to-tt/branch/master/graph/badge.svg" />
  </a>
</div>

<h1 align="center">babel-plugin-react-element-to-jsx-string</h1>

<blockquote align="center">This is a babel plugin to converts JSX into Tagged Templates</blockquote>

That can work with [hyperHTML](https://github.com/WebReflection/hyperHTML), [lit-html](https://github.com/Polymer/lit-html) or some other libraries to rendering templates to DOM.

- [Examples](#example)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)

---

## Examples

<details>
  <summary><strong>Attributes in lit-html</strong></summary>
  <div>

**In**

```jsx
const baz = (
  <div>
    <li attr1="A">First item</li>
    <li attr2="B">Second item</li>
    <li attr3={"C"}>Third item</li>
    <li class="main-colour">Third item</li>
    <li hidden={true}>Third item</li>
    <li onclick={() => console.log('test')}>Third item</li>
    <button color="blue" shadowSize={2} shadowSizeSum={2 + 1 + 1}>
      <small id={Date.now()}>Click Me</small>
    </button>
    <my-comp message={'hello world'}></my-comp>
    <my-text-box autocomplete={true} />
  </div>
);
```

**Out**

```js
const baz = html`<div>
  <li attr1="A">First item</li>
  <li attr2="B">Second item</li>
  <li .attr3=${"C"}>Third item</li>
  <li class="main-colour">Third item</li>
  <li ?hidden=${true}>Third item</li>
  <li @click=${() => console.log('test')}>Third item</li>
  <button color="blue" .shadowSize=${2} .shadowSizeSum=${2 + 1 + 1}>
    <small id=${Date.now()}>Click Me</small>
  </button>
  <my-comp .message=${'hello world'}></my-comp>
  <my-text-box .autocomplete=${true}></my-text-box>
</div>`;
```

**Options**

```json
{
  "tag": "html",
  "attributes": [
    {
      "preset": "lit-html"
    }
  ]
}
```

  </div>
</details>

<details>
  <summary><strong>Composition</strong></summary>
  <div>

**In**

**Bar.jsx**

```jsx
export class Bar {
  static define = (tag) => (properties) => AbstractElement;
  render() {
    return <p>Hello, World!</p>;
  }
}
```

**index.jsx**

```jsx
import { Bar } from './Bar';

const BarElement = Bar.define('bar-bar');

const define = (tag) => {};

const FooElement = define('foo-foo');

const baz = (
  <div>
    <p>Hello, World!</p>
    <BarElement></BarElement>
    <FooElement></FooElement>
    <p>Hello, World!</p>
  </div>
);
```

**Out**

```js
import { Bar } from './Bar';
const BarElement = Bar.define('bar-bar');

const define = (tag) => {};

const FooElement = define('foo-foo');
const baz = html`<div>
  <p>Hello, World!</p>
  <bar-bar></bar-bar>
  <foo-foo></foo-foo>
  <p>Hello, World!</p>
</div>`;
```

  </div>
</details>

<details>
  <summary><strong>Class component</strong></summary>
  <div>

**In**

```jsx
import { AbstractElement } from 'abstract-element';
import litRender from 'abstract-element/render/lit';

export class Loader extends AbstractElement {
  static define = (tag) => (properties) => AbstractElement;
  loading;

  constructor() {
    super(litRender, true);
  }

  render() {
    return this.loading ? <span>Loading 3 seconds, please...</span> : <span>That's a loaded content!</span>;
  }
}

const ElementLoader = Loader.define('a-a');

export class Converter extends AbstractElement {
  loading = true;

  constructor() {
    super(litRender, true);

    setInterval(() => {
      this.loading = !this.loading;
    }, 3000);
  }

  render() {
    return (
      <div>
        ⌛<ElementLoader loading={this.loading}></ElementLoader>
      </div>
    );
  }
}
```

**Out**

```js
import { html } from 'lit-html';
import { AbstractElement } from 'abstract-element';
import litRender from 'abstract-element/render/lit';
export class Loader extends AbstractElement {
  static define = (tag) => (properties) => AbstractElement;
  loading;

  constructor() {
    super(litRender, true);
  }

  render() {
    return this.loading ? html`<span>Loading 3 seconds, please...</span>` : html`<span>That's a loaded content!</span>`;
  }
}
const ElementLoader = Loader.define('a-a');
export class Converter extends AbstractElement {
  loading = true;

  constructor() {
    super(litRender, true);
    setInterval(() => {
      this.loading = !this.loading;
    }, 3000);
  }

  render() {
    return html`<div>⌛<a-a .loading=${this.loading}></a-a></div>`;
  }
}
```

**Options**

```json
{
  "tag": "html",
  "import": {
    "module": "lit-html",
    "export": "html"
  },
  "attributes": [
    {
      "preset": "lit-html"
    }
  ]
}
```

  </div>
</details>

Most examples in [abstract-element demo](https://github.com/inscriptum/abstract-element/tree/develop/demo/jsx).

---

## Installation

```sh
$ npm install babel-plugin-transform-jsx-to-tt
```

---

## Usage

### Via `.babelrc.json` (Recommended)

**.babelrc.json**

```json
{
  "plugins": ["babel-plugin-transform-jsx-to-tt"]
}
```

### Via CLI

```sh
$ babel --plugins babel-plugin-transform-jsx-to-tt script.js
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  plugins: ['babel-plugin-transform-jsx-to-tt'],
});
```

---

## Options

<table>
  <thead>
    <tr>
    <th>Option</th>
    <th>Type</th>
    <th>Default</th>
    <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tag</code>
      </td>
      <td>
        String
      </td>
      <td>
        <code>"html"</code>
      </td>
      <td>
        The tagged function name.
      </td>
    </tr>
    <tr>
      <td>
        <code>define</code>
      </td>
      <td>
        String
      </td>
      <td>
        <code></code>
      </td>
      <td>
        A function name for define Custom Element. The first argument of this function has to be a Custom Element name - String value.
      </td>
    </tr>
    <tr>
      <td>
        <code>import</code>
      </td>
      <td>
        <code>{ module: string; export: string }</code>
      </td>
      <td></td>
      <td>
        Add import for a tagged function.
      </td>
    </tr>
    <tr>
      <td>
        <code>attributes</code>
      </td>
      <td>
        <code>Array<{prefix: string; attributes: string[]; replace?: string;} | { preset?: 'lit-html' | 'global' }></code>
      </td>
      <td></td>
      <td>
        Mapping to convert JSX attributes.
      </td>
    </tr>
  </tbody>
</table>

These options could be passed to the Babel plugin using a nested array. A complex config example:

```js
"plugins": [
  ["babel-plugin-transform-jsx-to-htm", {
    "tag": "html",
    "define": "defineElement",
    "import": {
      "module": "some-html-render",
      "export": "html"
    },
    "attributes": [
      {
        "prefix": "",
        "attributes": [
          "on.*"
        ]
      },
      {
        "preset": "global"
      },
      {
        "prefix": "",
        "attributes": [
          "hidden",
          "draggable",
          "spellcheck"
        ]
      },
      {
        "prefix": ".",
        "attributes": [
          ".*"
        ]
      }
    ]
  }]
]
```
