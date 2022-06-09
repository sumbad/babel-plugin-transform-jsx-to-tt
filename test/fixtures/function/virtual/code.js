const CounterVirtual = VC((prop) => {
  const [count, setCount] = useState(0);

  return (
    <button type="button" onclick={() => setCount(count + 1)}>
      {count} {prop.msg}
    </button>
  );
});

const Link = () => [1].map((t) => <a>test1</a>);

const Image = () => <image>test2</image>;

const Div = function () {
  return <div>test3</div>;
};

function Span() {
  return <span>test4</span>;
}

FC('demo', () => {
  return (
    <>
      <CounterVirtual msg="Hello"></CounterVirtual>

      <Link></Link>

      <Image></Image>

      <Div></Div>

      <Span></Span>
    </>
  );
});
