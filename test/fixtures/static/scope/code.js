import { Bar } from './Bar';

const BarElement = Bar.define('bar-bar');

const define = tag => {};

const FooElement = define('foo-foo');

const baz = (
  <div>
    <p>Hello, World!</p>
    <BarElement></BarElement>
    <FooElement></FooElement>
    <p>Hello, World!</p>
  </div>
);
