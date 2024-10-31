export function assertNever(x: never): never {
  throw new Error(`Didn't expect: ${x}`);
}
