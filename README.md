# babel-plugin-transform-jsx-to-tt



## Example

**In**

```jsx
const baz = (
  <div>
    <li attr1="A">First item</li>
    <li attr2="B">Second item</li>
    <li attr3="C">Third item</li>
    <li class="main-colour">Third item</li>
    <li hidden={true}>Third item</li>
    <li onclick={()=>console.log('test')}>Third item</li>
    <button color="blue" shadowSize={2} shadowSizeSum={2+1+1}>
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
  <li .attr1="A">First item</li>
  <li .attr2="B">Second item</li>
  <li .attr3="C">Third item</li>
  <li class="main-colour">Third item</li>
  <li ?hidden=${true}>Third item</li>
  <li @click=${() => console.log("test")}>Third item</li>
  <button .color="blue" .shadowSize=${2} .shadowSizeSum=${2 + 1 + 1}>
    <small id=${Date.now()}>Click Me</small>
  </button>
  <my-comp .message=${"hello world"}></my-comp>
  <my-text-box .autocomplete=${true}></my-text-box>
</div>`;
```

## Installation

```sh
$ npm install babel-plugin-transform-jsx-to-tt
```

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
require("babel-core").transform("code", {
  plugins: ["babel-plugin-transform-jsx-to-tt"]
});
```
