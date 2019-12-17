import { defaultValue, serialize, validate, deserialize, is } from "./symbols"
import { Result } from "./result"

type Falsy = false | 0 | 0n | "" | null | undefined

type T__ = <U>(u: U) => number

interface FormTemplate<
  TData,
  TCanonical,
  TError,
  TSerialized,
  TDefault extends TData = TData,
  TTouched = boolean
> {
  default<TDefaultNew extends TData>(
    value: TDefaultNew,
  ): FormTemplate<TData, TCanonical, TError, TSerialized, TDefaultNew, TTouched>
  check<TErrorNew>(
    f: (value: TData) => TErrorNew | Falsy,
  ): FormTemplate<
    TData,
    TCanonical,
    TError | TErrorNew,
    TSerialized,
    TDefault,
    TTouched
  >
  convert<TCanonicalNew>(
    f: (value: TCanonical) => TCanonicalNew,
  ): FormTemplate<TData, TCanonicalNew, TError, TSerialized, TDefault, TTouched>
  optional: FormTemplate<
    TData | undefined,
    TCanonical | undefined,
    TSerialized | undefined,
    TError,
    undefined,
    TTouched
  >
  or<TOtherTemplate extends FormTemplate<any, any, any, any, any>>(
    other: TOtherTemplate,
  ): this | TOtherTemplate

  // Form API
  [defaultValue]: TDefault
  [validate](value: TData): Result<TCanonical, TError>
  [serialize](value: TData, touched: TTouched): TSerialized
  [deserialize](value: unknown): Result<[TData, TTouched], Error>
  [is](value: unknown): value is TData
}

type TDataOf<
  T extends FormTemplate<any, any, any, any, any>
> = T extends FormTemplate<infer U, any, any, any, any> ? U : never
type TDefaultOf<
  T extends FormTemplate<any, any, any, any, any>
> = T extends FormTemplate<any, infer U, any, any, any> ? U : never

interface FormTemplateNested<
  TData,
  TChildKeys,
  TChildTemplate extends FormTemplate<any, any, any, any, any>
> extends FormTemplate<TData, any, any, any, any> {
  /**
   * Return a map that uses the same key type as the data for its keys.
   *
   * This is used internally to store data that the library needs to keep track
   * of, such as the touched state and the dependency map.
   *
   * Ordinarily, you won't need to override the default, which is to just return
   * a JS Map object. The only time you might need to do this is if you're using
   * a data structure here that has different equality rules than JS's built-in
   * data structures, in which case you'll need to supply something that
   * implements the Map API but applies those same rules.
   *
   * Somewhat hypocritically, the library expects that the object returned by
   * this function can be safely mutated.
   */
  getMap<T>(): Map<TChildKeys, T>
  /**
   * Given a key, provide the form template object for that key.
   * @param k The key to provide a template for.
   */
  getChildTemplate(k: TChildKeys): TChildTemplate
  /**
   * Given an object and a key, retrieve the value associated with that key.
   * @param obj The object to perform the lookup on.
   * @param k The key to look up.
   */
  getChild(obj: TData, k: TChildKeys): TDataOf<TChildTemplate>
  /**
   * Create a copy of the given object, with the given key replaced with
   * a new value.
   * @param obj The base object.
   * @param k The key to replace.
   * @param v The value to replace it with.
   */
  setChild(obj: TData, k: TChildKeys, v: TDataOf<TChildTemplate>): TData
}

type GetChildTemplate<TTemplate, TChildKey> = TTemplate extends {
  getChildTemplate: (k: TChildKey) => infer U
}
  ? U
  : never

type TChildKeysOf<T> = T extends FormTemplateNested<any, infer TChildKeys, any>
  ? TChildKeys
  : never

type ObjInput = { [K: string]: FormTemplate<any, any, any, any, any> }
type ObjTData<T extends ObjInput> = {
  readonly [K in keyof T]: TDataOf<T[K]>
}
type ObjTDefault<T extends ObjInput> = {
  readonly [K in keyof T]: TDataOf<T[K]> & TDefaultOf<T[K]>
}

interface FormTemplateObj<T extends ObjInput>
  extends FormTemplate<ObjTData<T>, ObjTDefault<T>>,
    FormTemplateNested<keyof T> {
  getChildTemplate<K extends keyof T>(k: K): T[K]
  get<K extends keyof T>(obj: T, k: K): TDataOf<T[K]>
}

type FormTemplateObj_<T extends ObjInput> = FormTemplate<
  ObjTData<T>,
  ObjTDefault<T>,
  any,
  any,
  any
> &
  { [K in keyof T]: FormTemplateNested<T, K, T[K]> }[keyof T]

type _ObjTest = FormTemplateObj_<{
  a: FormTemplate<string, "">
  b: FormTemplate<string, "">
  o: FormTemplateObj<{
    a: FormTemplate<number, 1>
    b: FormTemplate<string, "">
  }>
}>

type _k = GetChildKeys<_ObjTest>
type _ca = GetChildTemplate<_ObjTest, "a">
