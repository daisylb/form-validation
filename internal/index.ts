type ValidationResult<TInput, TOutput, TErrors> =
  | { valid: false; value: TInput; errors: TErrors }
  | { valid: true; value: TOutput }

const validatorPrototype = {
  foo: 1,
  bar: function(): Validator_<unknown, string, string[]> {},
}

type ValidatorFunc<TInput, TOutput, TErrors> = (
  input: TInput,
) => ValidationResult<TInput, TOutput, TErrors>

type Validator_<TInput, TOutput, TErrors> = ValidatorFunc<
  TInput,
  TOutput,
  TErrors
> &
  typeof validatorPrototype

function makeValidator<TInput, TOutput, TErrors>(
  func: (input: TInput) => ValidationResult<TInput, TOutput, TErrors>,
): Validator2<TInput, TOutput, TErrors> {
  Object.setPrototypeOf(func, baseValidator)
  return func as Validator2<TInput, TOutput, TErrors>
}

interface Validator2<TInput, TOutput, TErrors> {
  (input: TInput): ValidationResult<TInput, TOutput, TErrors>
  string(
    this: Validator2<unknown, any, string[]>,
  ): Validator2<TInput, string, string[]>
  minLength(
    this: Validator2<unknown, string, string[]>,
    length: number,
  ): Validator2<TInput, string, string[]>
}

const baseValidator: Validator2<unknown, unknown, any> = i => ({
  valid: true,
  value: i,
})
baseValidator.string = function() {
  const _this = this
  return makeValidator(i => {
    const out = _this(i)
    if (typeof out.value === "string") return { valid: true, value: out.value }
    return {
      valid: false,
      value: i,
      errors: [...("errors" in out ? out.errors : []), "Not a string"],
    }
  })
}
baseValidator.minLength = function(length) {
  const _this = this
  return makeValidator(i => {
    const out = _this(i)
    if (!out.valid) return out
    if (out.value.length >= length) return { valid: true, value: out.value }
    return {
      valid: false,
      value: out.value,
      errors: [`Minimum ${length} characters`],
    }
  })
}

baseValidator.string().minLength(3)

makeValidator(i => ({ valid: true, value: i })).foo

function string(): Validator<unknown, string, string[]> {
  return i =>
    typeof i === "string"
      ? { valid: true, value: i }
      : { valid: false, value: i, errors: ["Not a string"] }
}

function minLength(len: number): Validator<string, string, string[]> {
  return i =>
    i.length >= len
      ? { valid: true, value: i }
      : { valid: false, value: i, errors: [`Minimum ${len} characters`] }
}

class Validator<TInput, TOutput, TErrors> {
  _func: ValidatorFunc<TInput, TOutput, TErrors>
  constructor(func: ValidatorFunc<TInput, TOutput, TErrors>) {
    this._func = func
  }

  foo(): Validator<TInput, string, string[]> {
    return this
  }
}

class Foo<In, Out> extends Function {
  constructor(func: Function) {
    Object.setPrototypeOf(func, Foo)
    return func
  }
  chain<In2, Out2>(func: (a: In2) => Out2): Foo<In, Out2> {
    return new Foo()
  }
}
