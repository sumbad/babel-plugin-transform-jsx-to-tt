const baz = html`<div>
  <li attr1="A">First item</li>
  <li attr2="B">Second item</li>
  <li attr3="${"C"}">Third item</li>
  <li class="main-colour">Third item</li>
  <li hidden="${true}">Third item</li>
  <li onclick="${() => console.log("test")}">Third item</li>
  <label for="${`btn_${Date.now()}`}"></label>
  <button
    id="${`btn_${Date.now()}`}"
    color="blue"
    shadowSize="${2}"
    shadowSizeSum="${2 + 1 + 1}"
  >
    <small id="${Date.now()}">Click Me</small>
  </button>
  <my-comp message="${"hello world"}"></my-comp>
  <my-text-box autocomplete="${true}"></my-text-box>
</div>`;
