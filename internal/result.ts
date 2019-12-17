type Ok<T> = Readonly<{ ok: true; value: T; unwrap(): T }>
type Err<E> = Readonly<{ ok: false; error: E; unwrap(): never }>
export type Result<T, E> = Ok<T> | Err<E>
const okProto: Omit<Ok<any>, "value"> = Object.freeze({
  ok: true,
  unwrap: function<T>(this: Ok<T>) {
    return this.value
  },
})
export function ok<T>(value: T): Ok<T> {
  return Object.setPrototypeOf({ value }, okProto)
}
const errProto: Omit<Err<any>, "error"> = Object.freeze({
  ok: false,
  unwrap: function<E>(this: Err<E>) {
    throw this.error
  },
})
export function err<E>(error: E): Err<E> {
  return Object.setPrototypeOf({ error }, errProto)
}

export function all<T, E>(results: Iterable<Result<T, E>>): Result<T[], E> {
  const out = []
  for (let result of results) {
    if (!result.ok) return result
    out.push(result.value)
  }
  return ok(out)
}

export function first<T, E>(results: Iterable<Result<T, E>>): Result<T, E[]> {
  const errs = []
  for (let result of results) {
    if (result.ok) return result
    errs.push(result.error)
  }
  return err(errs)
}
