import { Scope, Binding } from '@babel/traverse';

export function flatten<T>(arr: T[][]) {
  return arr.reduce((prev, curr) => [...prev, ...curr], []);
}

export function has(identName: string) {
  let { name } = this;

  return identName === name;
}

export function getDefined(identifierName: string, { bindings, parent }: Scope): Binding | undefined {
  let variables = Object.keys(bindings);

  if (variables.some(has, { name: identifierName })) {
    return bindings[identifierName];
  }

  return parent ? getDefined(identifierName, parent) : undefined;
}
