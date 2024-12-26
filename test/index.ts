import * as assert from 'node:assert/strict';
import { test } from 'node:test';
import { DefaultCase as _, match, Case as when } from '../lib';

test('Matching numbers with a single failing match returns the default case value', () => {
  const result = match(
    1,
    _(-1),
    when(4, (x) => x + 1),
  );

  assert.equal(-1, result);
});

test('Matching numbers with a single failing match uses the result of a default value fn', () => {
  const result = match<number, number>(
    1,
    _(() => 42),
    when(-1, (x) => x + 1),
  );
  assert.equal(42, result);
});

test('Matching numbers with a single passing match returns the result of the fn', () => {
  const result = match(
    1,
    _(-1),
    when(1, (x) => x + 1),
  );
  assert.equal(2, result);
});

test('Matching strings with a single passing match returns the result of the fn', () => {
  const result = match(
    'Lorem ipsum',
    _(-1),
    when('Lorem ipsum', (x) => x.length),
  );
  assert.equal(11, result);
});

test('Matching strings with a single failing match returns the default case value', () => {
  const result = match(
    'Lorem ipsum',
    _(-42),
    when('Wat', (s) => s.length),
  );
  assert.equal(-42, result);
});

test('Matching strings with a single failing match uses the result of a default value fn', () => {
  const result = match(
    'Lorem ipsum',
    _(() => -42),
    when('Wat', (s) => s.length),
  );
  assert.equal(-42, result);
});

class A {
  constructor(
    public readonly a: number,
    public readonly name: string,
  ) {
    /* empty */
  }
}
class B {
  constructor(
    public readonly b: number,
    public readonly name: string,
  ) {
    /* empty */
  }
}
class C {
  constructor(
    public readonly c: number,
    public readonly name: string,
  ) {
    /* empty */
  }
}
type Foo = A | B | C;

test('Matching types with a single failing match returns the default case value', () => {
  const s: Foo = new B(10, 'busy bee');
  const result = match<Foo, number>(
    s,
    _(-42),
    when(A, (s) => s.a),
  );
  assert.equal(-42, result);
});

test('Matching types with a single failing match uses the result of a default value fn', () => {
  const s: Foo = new B(10, 'busy bee');
  const result = match<Foo, number>(
    s,
    _(() => -42),
    when(A, (s) => s.a),
  );
  assert.equal(-42, result);
});

test('Matching types with a single match returns the result of the match', () => {
  const s: Foo = new A(55, 'test string');
  const result = match<Foo, number>(
    s,
    _(-42),
    when(A, (s) => s.a),
  );
  assert.equal(55, result);
});

test('Matching types with multiple match cases matches the value correctly and returns the result of the match', () => {
  const s: Foo = new C(5, 'test string');
  const result = match<Foo, number>(
    s,
    _(-42),
    when(A, (s) => s.a),
    when(B, (s) => s.b),
    when(C, (s) => s.c),
  );
  assert.equal(5, result);
});

test('Matching types to types with multiple match cases matches correctly and returns the result of the match', () => {
  const s: Foo = new C(5, 'test string');
  const result = match<Foo, Foo>(
    s,
    _(new B(3, 'foo')),
    when(A, (s) => new A(s.a, s.name)),
    when(B, (s) => new B(s.b, s.name)),
    when(C, (s) => new C(s.c, 'Success')),
  );
  assert.deepEqual(result.name, 'Success');
});

test('Matching types with multiple match cases matches the value correctly and returns nothing', () => {
  const s: Foo = new B(42, 'test string');
  match<Foo, void>(
    s,
    _(),
    when(B, (_) => undefined),
    when(A, (_) => assert.fail('Should not match')),
    when(C, (_) => assert.fail('Should not match')),
  );
});

test('Matching values evaluates the default function if no cases match', () => {
  match<number, void>(
    4,
    _(() => assert.ok(true)),
    when(1, (n) => assert.fail(`The case for ${n} should not match`)),
    when(2, (n) => assert.fail(`The case for ${n} should not match`)),
    when(3, (n) => assert.fail(`The case for ${n} should not match`)),
  );
});

test('Matching values does NOT evaluate the default function when a case matches', () => {
  match<number, void>(
    1,
    _(() => assert.fail('The default case should not be evaluated')),
    when(1, (_) => assert.ok(true)),
    when(2, (n) => assert.fail(`The case for ${n} should not match`)),
    when(3, (n) => assert.fail(`The case for ${n} should not match`)),
  );
});
