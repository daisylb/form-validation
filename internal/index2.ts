const DEFAULT = Symbol("DEFAULT")
type DEFAULT = typeof DEFAULT

const EXTEND = Symbol("EXTEND")
type EXTEND = typeof EXTEND

function extend<ST extends object, T extends object>(
  superobj: ST,
  obj: T,
): T & Omit<ST, keyof T> {
  Object.setPrototypeOf(obj, superobj)
  return obj as T & Omit<ST, keyof T>
}

interface FormTemplate<TData, TDefault extends TData> {
  [DEFAULT]: TDefault
  default<TDefaultNew extends TData>(
    value: TDefaultNew,
  ): FormTemplate<TData, TDefaultNew>
}

type TDataOf<T> = T extends FormTemplate<infer U, any> ? U : never

type TDefaultOf<T extends FormTemplate<any, any>> = T extends FormTemplate<
  any,
  infer U
>
  ? U
  : never

const formTemplateProto = {
  default: function<T, TD extends T>(
    this: FormTemplate<T, any>,
    val: TD,
  ): FormTemplate<T, TD> {
    return Object.create(this, {
      default: { writable: false, configurable: false, value: val },
    })
  },
}

export const string: FormTemplate<string, ""> = extend(formTemplateProto, {
  [DEFAULT]: "",
} as const)

type FormTemplateObjInput = { [k: string]: FormTemplate<any, any> }

type GetArguments<T> = T extends {
  get: (...args: infer U) => any
}
  ? { [K in keyof U]?: U[K] }
  : never

type Tail<T extends any[]> = ((...a: T) => any) extends (
  a1: any,
  ...as: infer U
) => any
  ? U
  : never

type __ = Tail<[1, 2, 3]>

interface FormTemplateNested<K> {
  getChildTemplate(k: K): FormTemplate<any, any>
  get(obj: any, k: K): any
}

type GetChildTemplate<T, K> = T extends {
  getChildTemplate: (obj: any, k: K) => infer U
}
  ? U
  : never

type Tuple09 =
  | readonly []
  | readonly [any]
  | readonly [any, any]
  | readonly [any, any, any]
  | readonly [any, any, any, any]
  | readonly [any, any, any, any, any]
  | readonly [any, any, any, any, any, any]
  | readonly [any, any, any, any, any, any, any]
  | readonly [any, any, any, any, any, any, any, any]
  | readonly [any, any, any, any, any, any, any, any, any]

type GetKeys<T> = T extends { getChildTemplate: (obj: any, k: infer K) => any }
  ? K
  : never

type GetKeysIn<T> =
  | []
  | (GetKeys<T> extends infer K
      ? GetChildTemplate<T, K> extends infer U
        ? GetKeysIn2<U, K>
        : never
      : never)

type GetKeysIn2<T, KL> =
  | [KL]
  | (KL extends any
      ? GetKeys<T> extends infer K
        ? GetChildTemplate<T, K> extends infer U
          ? GetKeysIn3<U, KL, K>
          : never
        : never
      : never)

type GetKeysIn3<T, K1, KL> =
  | [K1, KL]
  | (KL extends any
      ? GetKeys<T> extends infer K
        ? GetChildTemplate<T, K> extends infer U
          ? GetKeysIn4<U, K1, KL, K>
          : never
        : never
      : never)

type GetKeysIn4<T, K1, K2, KL> = [K1, K2, KL]
// | (KL extends any
//     ? GetKeys<T> extends infer K
//       ? GetChildTemplate<T, K> extends infer U
//         ? GetKeysIn5<U, K1, K2, KL, K>
//         : never
//       : never
//     : never)

type GetChildTemplateIn<
  T,
  P extends readonly any[]
> = T extends FormTemplateNested<any>
  ? P extends readonly [
      infer K1,
      infer K2,
      infer K3,
      infer K4,
      infer K5,
      infer K6,
      infer K7,
      infer K8,
      infer K9,
    ]
    ? GetChildTemplate<
        GetChildTemplate<
          GetChildTemplate<
            GetChildTemplate<
              GetChildTemplate<
                GetChildTemplate<
                  GetChildTemplate<
                    GetChildTemplate<GetChildTemplate<T, K1>, K2>,
                    K3
                  >,
                  K4
                >,
                K5
              >,
              K6
            >,
            K7
          >,
          K8
        >,
        K9
      >
    : P extends readonly [
        infer K1,
        infer K2,
        infer K3,
        infer K4,
        infer K5,
        infer K6,
        infer K7,
        infer K8,
      ]
    ? GetChildTemplate<
        GetChildTemplate<
          GetChildTemplate<
            GetChildTemplate<
              GetChildTemplate<
                GetChildTemplate<
                  GetChildTemplate<GetChildTemplate<T, K1>, K2>,
                  K3
                >,
                K4
              >,
              K5
            >,
            K6
          >,
          K7
        >,
        K8
      >
    : P extends readonly [
        infer K1,
        infer K2,
        infer K3,
        infer K4,
        infer K5,
        infer K6,
        infer K7,
      ]
    ? GetChildTemplate<
        GetChildTemplate<
          GetChildTemplate<
            GetChildTemplate<
              GetChildTemplate<
                GetChildTemplate<GetChildTemplate<T, K1>, K2>,
                K3
              >,
              K4
            >,
            K5
          >,
          K6
        >,
        K7
      >
    : P extends readonly [
        infer K1,
        infer K2,
        infer K3,
        infer K4,
        infer K5,
        infer K6,
      ]
    ? GetChildTemplate<
        GetChildTemplate<
          GetChildTemplate<
            GetChildTemplate<GetChildTemplate<GetChildTemplate<T, K1>, K2>, K3>,
            K4
          >,
          K5
        >,
        K6
      >
    : P extends readonly [infer K1, infer K2, infer K3, infer K4, infer K5]
    ? GetChildTemplate<
        GetChildTemplate<
          GetChildTemplate<GetChildTemplate<GetChildTemplate<T, K1>, K2>, K3>,
          K4
        >,
        K5
      >
    : P extends readonly [infer K1, infer K2, infer K3, infer K4]
    ? GetChildTemplate<
        GetChildTemplate<GetChildTemplate<GetChildTemplate<T, K1>, K2>, K3>,
        K4
      >
    : P extends readonly [infer K1, infer K2, infer K3]
    ? GetChildTemplate<GetChildTemplate<GetChildTemplate<T, K1>, K2>, K3>
    : P extends readonly [infer K1, infer K2]
    ? GetChildTemplate<GetChildTemplate<T, K1>, K2>
    : P extends readonly [infer K1]
    ? GetChildTemplate<T, K1>
    : P extends readonly []
    ? T
    : { p: P }
  : never

type ObjTData<T extends FormTemplateObjInput> = {
  readonly [K in keyof T]: TDataOf<T[K]>
}

interface FormTemplateObj<T extends FormTemplateObjInput>
  extends FormTemplate<
      ObjTData<T>,
      { readonly [K in keyof T]: TDataOf<T[K]> & TDefaultOf<T[K]> }
    >,
    FormTemplateNested<keyof T> {
  getChildTemplate<K extends keyof T>(k: K): T[K]
  get<K extends keyof T>(obj: T, k: K): TDataOf<T[K]>
  getIn<KS extends GetKeysIn<T>>(
    obj: ObjTData<T>,
    ks: KS,
  ): TDataOf<GetChildTemplateIn<T, KS>>
}

const objTemplateProto = Object.create(formTemplateProto)

export function object<T extends FormTemplateObjInput>(
  keys: T,
): FormTemplateObj<T> {
  return Object.create(objTemplateProto, {
    [DEFAULT]: {
      writable: false,
      configurable: false,
      value: Object.fromEntries(
        Object.entries(keys).map(([k, v]) => [k, v.default]),
      ),
    },
  })
}

const test = object({ a: string.default("a"), b: string }).default({
  a: "b",
  b: "a",
} as const)

const test2 = object({
  a: object({ a: object({ a: object({ b: string }) }) }),
})

const stri = test2.getIn(test2[DEFAULT], ["a"])
type _ = TDataOf<GetChildTemplateIn<typeof test2, readonly ["a", "a", "a"]>>
type Test2 = TDataOf<typeof test2>
