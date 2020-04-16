import { AbstractElement } from 'abstract-element';
import litRender from 'abstract-element/render/lit';


export class Loader extends AbstractElement {
  static define = tag => properties => AbstractElement;
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
