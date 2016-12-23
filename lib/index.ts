type Predicate<T> = (t: T) => boolean;
type Function<T, R> = (t: T) => R;
type Type<T> = new(...args: any[]) => T;

interface ICase<T, R> {
    matches: Predicate<T>,
    fn: Function<T, R>,
}

interface IDefaultCase<R> {
    value: R,
}

function Case<R>(value: string, fn: Function<string, R>): ICase<string, R>;
function Case<R>(value: number, fn: Function<number, R>): ICase<number, R>;
function Case<T, R>(value: Type<T>, fn: Function<T, R>): ICase<T, R>;
function Case<R>(value: any, fn: Function<any, R>): ICase<any, R> {
    return {
        fn,
        matches: (x) => (
               (typeof value === "function" && x instanceof value)
            || (typeof value === typeof x && value === x)
        ),
    };
}

function DefaultCase(): IDefaultCase<void>;
function DefaultCase(value: number): IDefaultCase<number>;
function DefaultCase<R>(value?: R): IDefaultCase<R | void> {
    return {
        value
    };
}

function match<T, R>(input: T, defaultCase: IDefaultCase<R>, ...cases: ICase<T, R>[]): R {
    for (const k of cases) {
        if (k.matches(input)) {
            return k.fn(input);
        }
    }
    return defaultCase.value;
}

export {Predicate, Function, Type, ICase, Case, IDefaultCase, DefaultCase, match}