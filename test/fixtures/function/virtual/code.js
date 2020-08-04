const CounterVirtual = VC((prop) => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      {count} {prop.msg}
    </button>
  );
});


FC('demo', () => {
  return (
    <>
      <CounterVirtual msg="Hello"></CounterVirtual>
    </>
  );
});