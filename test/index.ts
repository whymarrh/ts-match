import * as test from 'tape';
import {match, Case as when, DefaultCase as _} from '../lib';

test(`Matching numbers with a single failing match returns the default case value`, (t) => {
    t.plan(1);

    const result = match(1,
        _(-1),
        when(4, x => x + 1),
    );
    t.equal(-1, result);
});

test(`Matching numbers with a single passing match returns the result of the fn`, (t) => {
    t.plan(1);

    const result = match(1,
        _(-1),
        when(1, x => x + 1),
    );
    t.equal(2, result);
});

test(`Matching strings with a single passing match returns the result of the fn`, (t) => {
    t.plan(1);

    const result = match(`Lorem ipsum`,
        _(-1),
        when(`Lorem ipsum`, x => x.length),
    );
    t.equal(11, result);
});

test(`Matching strings with a single failing match returns the default case value`, (t) => {
    t.plan(1);

    const result = match(`Lorem ipsum`,
        _(-42),
        when(`Wat`, s => s.length),
    );
    t.equal(-42, result);
});

class A { constructor(public readonly a: number, public readonly name: string) { /* ??? */ } }
class B { constructor(public readonly b: number, public readonly name: string) { /* ??? */ } }
class C { constructor(public readonly c: number, public readonly name: string) { /* ??? */ } }
type Foo = A | B | C

test(`Matching types with a single failing match returns the default case value`, (t) => {
    t.plan(1);

    const s: Foo = new B(10, `busy bee`);
    const result = match<Foo, number>(s,
        _(-42),
        when(A, s => s.a),
    );
    t.equal(-42, result);
});

test(`Matching types with a single match returns the result of the match`, (t) => {
    t.plan(1);

    const s: Foo = new A(55, `test string`);
    const result = match<Foo, number>(s,
        _(-42),
        when(A, s => s.a),
    );
    t.equal(55, result);
});

test(`Matching types with multiple match cases matches the value correctly and returns the result of the match`, (t) => {
    t.plan(1);

    const s: Foo = new C(5, `test string`);
    const result = match<Foo, number>(s,
        _(-42),
        when(A, s => s.a),
        when(B, s => s.b),
        when(C, s => s.c),
    );
    t.equal(5, result);
});

test(`Matching types with multiple match cases matches the value correctly and returns nothing`, (t) => {
    t.plan(1);

    const s: Foo = new B(42, `test string`);
    match<Foo, void>(s,
        _(),
        when(B, _ => t.pass()),
        when(A, _ => {}),
        when(C, _ => {}),
    );
});
