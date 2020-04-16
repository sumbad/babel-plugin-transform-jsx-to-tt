import { html } from "lit-html";
import { AbstractElement } from "abstract-element";
import litRender from "abstract-element/render/lit";
export class Loader extends AbstractElement {
  static define = (tag) => (properties) => AbstractElement;
  loading;

  constructor() {
    super(litRender, true);
  }

  render() {
    return this.loading
      ? html`<span>Loading 3 seconds, please...</span>`
      : html`<span>That's a loaded content!</span>`;
  }
}
const ElementLoader = Loader.define("a-a");
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