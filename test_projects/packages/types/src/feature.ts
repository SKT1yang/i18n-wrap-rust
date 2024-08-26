// 要实现一个 TypeScript 工具类型，可以将形如 `a::b::c` 的字符串转化为联合类型 `a | a::b | a::b::c`。这个工具类型将递归地解析字符串，并构建出所需的联合类型。

// 解释：
// 1. `Split<S extends string, D extends string>`：将字符串 `S` 按照分隔符 `D` 分割成字符串数组。
// 2. `Join<T extends string[], D extends string>`：将字符串数组 `T` 按照分隔符 `D` 重新连接成字符串。
// 3. `CreateUnion<T extends string[], D extends string>`：递归地创建联合类型，将数组中的每个部分组合起来。
// 4. `GenerateUnion<S extends string, D extends string>`：首先使用 `Split` 将字符串 `S` 分割成数组，然后使用 `CreateUnion` 生成联合类型。

// 这样就可以使用 `GenerateUnion` 来生成所需的联合类型了。

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type Join<T extends string[], D extends string> = T extends []
  ? ''
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${R extends [] ? '' : `${D}${Join<Extract<R, string[]>, D>}`}`
    : never
  : never;

type CreateUnion<T extends string[], D extends string> = T extends [
  infer F,
  ...infer R
]
  ? F extends string
    ? R extends string[]
      ? F | `${F}${D}${CreateUnion<R, D>}`
      : never
    : never
  : never;

type GenerateUnion<S extends string, D extends string = '::'> = CreateUnion<
  Split<S, D>,
  D
>;

/**
 * 将联合类型合并，也就是将所有特性合并成Feature
 */
type GenerateFeature<T extends string[]> = GenerateUnion<T[number]>;

// // 使用示例
// type Result = GenerateUnion<'a::b::c'>;
// type Result2 = GenerateUnion<'a::b::d'>;
// type Result3 = Result | Result2;
// Result 应该是 a | a::b | a::b::c
// Result3 应该是 "a::b::c" | "a" | "a::b" | "a::b::d"
// type Features = GenerateFeatures<['a::b::c::f', 'a::b::d', 'x::y::z']>;

export type { Join, Split, CreateUnion, GenerateUnion, GenerateFeature };
