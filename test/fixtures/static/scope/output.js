import { Bar } from "./Bar";
const BarElement = Bar.define("bar-bar");

const define = (tag) => {};

const FooElement = define("foo-foo");
const baz = html`<div>
  <p>Hello, World!</p>
  <bar-bar></bar-bar>
  <foo-foo></foo-foo>
  <p>Hello, World!</p>
</div>`;
