export class DemoComponent {
  dataDemo = 'component';

  state = {
    time: new Date().toLocaleTimeString()
  };

  render() {
    return (
      <section>
        <p>Test {this.dataDemo}</p>
        <div>{this.state.time}</div>
      </section>
    );
  }
}
