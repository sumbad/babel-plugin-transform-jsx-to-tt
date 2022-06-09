const CounterVirtual = VC((prop) => {
  const [count, setCount] = useState(0);
  return html`<button type="button" onclick=${() => setCount(count + 1)}>
    ${count} ${prop.msg}
  </button>`;
});

const Link = () => [1].map((t) => html`<a>test1</a>`);

const Image = () => html`<image></image>`;

const Div = function () {
  return html`<div>test3</div>`;
};

function Span() {
  return html`<span>test4</span>`;
}

FC("demo", () => {
  return html`
    ${CounterVirtual({
      msg: "Hello",
    })}
    ${Link({})} ${Image({})} ${Div({})} ${Span({})}
  `;
});