ts-match
========

A small matching library for TypeScript. The API is a single function defined as:

```typescript
function match<T, R>(input: T, defaultCase: IDefaultCase<R>, ...cases: ICase<T, R>[]): R
````

Example:

```typescript
const s: Foo = new C(5, `test string`);
const result = match<Foo, number>(s,
    _(-42),
    when(A, s => s.a),
    when(B, s => s.b),
    when(C, s => s.c),
);
```

## Quick start

Install via:

```
$ yarn add ts-match
```
