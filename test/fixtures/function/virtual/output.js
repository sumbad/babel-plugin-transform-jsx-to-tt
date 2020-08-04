const CounterVirtual = VC((prop) => {
  const [count, setCount] = useState(0);
  return html`<button type="button" onclick=${() => setCount(count + 1)}>
    ${count} ${prop.msg}
  </button>`;
});
FC("demo", () => {
  return html`
    ${CounterVirtual({
      msg: "Hello",
    })}
  `;
});