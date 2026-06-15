
/**
 * Client
**/

import * as runtime from './runtime/client';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Flavor
 * 
 */
export type Flavor = $Result.DefaultSelection<Prisma.$FlavorPayload>
/**
 * Model Operator
 * 
 */
export type Operator = $Result.DefaultSelection<Prisma.$OperatorPayload>
/**
 * Model Lot
 * 
 */
export type Lot = $Result.DefaultSelection<Prisma.$LotPayload>
/**
 * Model LotEvent
 * 
 */
export type LotEvent = $Result.DefaultSelection<Prisma.$LotEventPayload>
/**
 * Model Partner
 * 
 */
export type Partner = $Result.DefaultSelection<Prisma.$PartnerPayload>
/**
 * Model Shipment
 * 
 */
export type Shipment = $Result.DefaultSelection<Prisma.$ShipmentPayload>
/**
 * Model ShipmentItem
 * 
 */
export type ShipmentItem = $Result.DefaultSelection<Prisma.$ShipmentItemPayload>
/**
 * Model ShipmentEvent
 * 
 */
export type ShipmentEvent = $Result.DefaultSelection<Prisma.$ShipmentEventPayload>
/**
 * Model AppUser
 * 
 */
export type AppUser = $Result.DefaultSelection<Prisma.$AppUserPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model IdempotencyKey
 * 
 */
export type IdempotencyKey = $Result.DefaultSelection<Prisma.$IdempotencyKeyPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Flavors
 * const flavors = await prisma.flavor.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Flavors
   * const flavors = await prisma.flavor.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.flavor`: Exposes CRUD operations for the **Flavor** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Flavors
    * const flavors = await prisma.flavor.findMany()
    * ```
    */
  get flavor(): Prisma.FlavorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.operator`: Exposes CRUD operations for the **Operator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Operators
    * const operators = await prisma.operator.findMany()
    * ```
    */
  get operator(): Prisma.OperatorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lot`: Exposes CRUD operations for the **Lot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lots
    * const lots = await prisma.lot.findMany()
    * ```
    */
  get lot(): Prisma.LotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lotEvent`: Exposes CRUD operations for the **LotEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LotEvents
    * const lotEvents = await prisma.lotEvent.findMany()
    * ```
    */
  get lotEvent(): Prisma.LotEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.partner`: Exposes CRUD operations for the **Partner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Partners
    * const partners = await prisma.partner.findMany()
    * ```
    */
  get partner(): Prisma.PartnerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipment`: Exposes CRUD operations for the **Shipment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shipments
    * const shipments = await prisma.shipment.findMany()
    * ```
    */
  get shipment(): Prisma.ShipmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipmentItem`: Exposes CRUD operations for the **ShipmentItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShipmentItems
    * const shipmentItems = await prisma.shipmentItem.findMany()
    * ```
    */
  get shipmentItem(): Prisma.ShipmentItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.shipmentEvent`: Exposes CRUD operations for the **ShipmentEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ShipmentEvents
    * const shipmentEvents = await prisma.shipmentEvent.findMany()
    * ```
    */
  get shipmentEvent(): Prisma.ShipmentEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appUser`: Exposes CRUD operations for the **AppUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppUsers
    * const appUsers = await prisma.appUser.findMany()
    * ```
    */
  get appUser(): Prisma.AppUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.idempotencyKey`: Exposes CRUD operations for the **IdempotencyKey** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IdempotencyKeys
    * const idempotencyKeys = await prisma.idempotencyKey.findMany()
    * ```
    */
  get idempotencyKey(): Prisma.IdempotencyKeyDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Flavor: 'Flavor',
    Operator: 'Operator',
    Lot: 'Lot',
    LotEvent: 'LotEvent',
    Partner: 'Partner',
    Shipment: 'Shipment',
    ShipmentItem: 'ShipmentItem',
    ShipmentEvent: 'ShipmentEvent',
    AppUser: 'AppUser',
    AuditLog: 'AuditLog',
    IdempotencyKey: 'IdempotencyKey'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "flavor" | "operator" | "lot" | "lotEvent" | "partner" | "shipment" | "shipmentItem" | "shipmentEvent" | "appUser" | "auditLog" | "idempotencyKey"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Flavor: {
        payload: Prisma.$FlavorPayload<ExtArgs>
        fields: Prisma.FlavorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlavorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlavorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>
          }
          findFirst: {
            args: Prisma.FlavorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlavorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>
          }
          findMany: {
            args: Prisma.FlavorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>[]
          }
          create: {
            args: Prisma.FlavorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>
          }
          createMany: {
            args: Prisma.FlavorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlavorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>[]
          }
          delete: {
            args: Prisma.FlavorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>
          }
          update: {
            args: Prisma.FlavorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>
          }
          deleteMany: {
            args: Prisma.FlavorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlavorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlavorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>[]
          }
          upsert: {
            args: Prisma.FlavorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlavorPayload>
          }
          aggregate: {
            args: Prisma.FlavorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlavor>
          }
          groupBy: {
            args: Prisma.FlavorGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlavorGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlavorCountArgs<ExtArgs>
            result: $Utils.Optional<FlavorCountAggregateOutputType> | number
          }
        }
      }
      Operator: {
        payload: Prisma.$OperatorPayload<ExtArgs>
        fields: Prisma.OperatorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OperatorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OperatorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>
          }
          findFirst: {
            args: Prisma.OperatorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OperatorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>
          }
          findMany: {
            args: Prisma.OperatorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>[]
          }
          create: {
            args: Prisma.OperatorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>
          }
          createMany: {
            args: Prisma.OperatorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OperatorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>[]
          }
          delete: {
            args: Prisma.OperatorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>
          }
          update: {
            args: Prisma.OperatorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>
          }
          deleteMany: {
            args: Prisma.OperatorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OperatorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OperatorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>[]
          }
          upsert: {
            args: Prisma.OperatorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OperatorPayload>
          }
          aggregate: {
            args: Prisma.OperatorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOperator>
          }
          groupBy: {
            args: Prisma.OperatorGroupByArgs<ExtArgs>
            result: $Utils.Optional<OperatorGroupByOutputType>[]
          }
          count: {
            args: Prisma.OperatorCountArgs<ExtArgs>
            result: $Utils.Optional<OperatorCountAggregateOutputType> | number
          }
        }
      }
      Lot: {
        payload: Prisma.$LotPayload<ExtArgs>
        fields: Prisma.LotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          findFirst: {
            args: Prisma.LotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          findMany: {
            args: Prisma.LotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>[]
          }
          create: {
            args: Prisma.LotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          createMany: {
            args: Prisma.LotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>[]
          }
          delete: {
            args: Prisma.LotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          update: {
            args: Prisma.LotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          deleteMany: {
            args: Prisma.LotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>[]
          }
          upsert: {
            args: Prisma.LotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotPayload>
          }
          aggregate: {
            args: Prisma.LotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLot>
          }
          groupBy: {
            args: Prisma.LotGroupByArgs<ExtArgs>
            result: $Utils.Optional<LotGroupByOutputType>[]
          }
          count: {
            args: Prisma.LotCountArgs<ExtArgs>
            result: $Utils.Optional<LotCountAggregateOutputType> | number
          }
        }
      }
      LotEvent: {
        payload: Prisma.$LotEventPayload<ExtArgs>
        fields: Prisma.LotEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LotEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LotEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>
          }
          findFirst: {
            args: Prisma.LotEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LotEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>
          }
          findMany: {
            args: Prisma.LotEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>[]
          }
          create: {
            args: Prisma.LotEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>
          }
          createMany: {
            args: Prisma.LotEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LotEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>[]
          }
          delete: {
            args: Prisma.LotEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>
          }
          update: {
            args: Prisma.LotEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>
          }
          deleteMany: {
            args: Prisma.LotEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LotEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LotEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>[]
          }
          upsert: {
            args: Prisma.LotEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LotEventPayload>
          }
          aggregate: {
            args: Prisma.LotEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLotEvent>
          }
          groupBy: {
            args: Prisma.LotEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<LotEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.LotEventCountArgs<ExtArgs>
            result: $Utils.Optional<LotEventCountAggregateOutputType> | number
          }
        }
      }
      Partner: {
        payload: Prisma.$PartnerPayload<ExtArgs>
        fields: Prisma.PartnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PartnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PartnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          findFirst: {
            args: Prisma.PartnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PartnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          findMany: {
            args: Prisma.PartnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>[]
          }
          create: {
            args: Prisma.PartnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          createMany: {
            args: Prisma.PartnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PartnerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>[]
          }
          delete: {
            args: Prisma.PartnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          update: {
            args: Prisma.PartnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          deleteMany: {
            args: Prisma.PartnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PartnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PartnerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>[]
          }
          upsert: {
            args: Prisma.PartnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          aggregate: {
            args: Prisma.PartnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePartner>
          }
          groupBy: {
            args: Prisma.PartnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PartnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PartnerCountArgs<ExtArgs>
            result: $Utils.Optional<PartnerCountAggregateOutputType> | number
          }
        }
      }
      Shipment: {
        payload: Prisma.$ShipmentPayload<ExtArgs>
        fields: Prisma.ShipmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          findFirst: {
            args: Prisma.ShipmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          findMany: {
            args: Prisma.ShipmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          create: {
            args: Prisma.ShipmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          createMany: {
            args: Prisma.ShipmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          delete: {
            args: Prisma.ShipmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          update: {
            args: Prisma.ShipmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentPayload>
          }
          aggregate: {
            args: Prisma.ShipmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipment>
          }
          groupBy: {
            args: Prisma.ShipmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentCountAggregateOutputType> | number
          }
        }
      }
      ShipmentItem: {
        payload: Prisma.$ShipmentItemPayload<ExtArgs>
        fields: Prisma.ShipmentItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          findFirst: {
            args: Prisma.ShipmentItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          findMany: {
            args: Prisma.ShipmentItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          create: {
            args: Prisma.ShipmentItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          createMany: {
            args: Prisma.ShipmentItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          delete: {
            args: Prisma.ShipmentItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          update: {
            args: Prisma.ShipmentItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentItemPayload>
          }
          aggregate: {
            args: Prisma.ShipmentItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipmentItem>
          }
          groupBy: {
            args: Prisma.ShipmentItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentItemCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentItemCountAggregateOutputType> | number
          }
        }
      }
      ShipmentEvent: {
        payload: Prisma.$ShipmentEventPayload<ExtArgs>
        fields: Prisma.ShipmentEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShipmentEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShipmentEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          findFirst: {
            args: Prisma.ShipmentEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShipmentEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          findMany: {
            args: Prisma.ShipmentEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>[]
          }
          create: {
            args: Prisma.ShipmentEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          createMany: {
            args: Prisma.ShipmentEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShipmentEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>[]
          }
          delete: {
            args: Prisma.ShipmentEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          update: {
            args: Prisma.ShipmentEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          deleteMany: {
            args: Prisma.ShipmentEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShipmentEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ShipmentEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>[]
          }
          upsert: {
            args: Prisma.ShipmentEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShipmentEventPayload>
          }
          aggregate: {
            args: Prisma.ShipmentEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShipmentEvent>
          }
          groupBy: {
            args: Prisma.ShipmentEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShipmentEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShipmentEventCountArgs<ExtArgs>
            result: $Utils.Optional<ShipmentEventCountAggregateOutputType> | number
          }
        }
      }
      AppUser: {
        payload: Prisma.$AppUserPayload<ExtArgs>
        fields: Prisma.AppUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          findFirst: {
            args: Prisma.AppUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          findMany: {
            args: Prisma.AppUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>[]
          }
          create: {
            args: Prisma.AppUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          createMany: {
            args: Prisma.AppUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppUserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>[]
          }
          delete: {
            args: Prisma.AppUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          update: {
            args: Prisma.AppUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          deleteMany: {
            args: Prisma.AppUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppUserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>[]
          }
          upsert: {
            args: Prisma.AppUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppUserPayload>
          }
          aggregate: {
            args: Prisma.AppUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppUser>
          }
          groupBy: {
            args: Prisma.AppUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppUserCountArgs<ExtArgs>
            result: $Utils.Optional<AppUserCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      IdempotencyKey: {
        payload: Prisma.$IdempotencyKeyPayload<ExtArgs>
        fields: Prisma.IdempotencyKeyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IdempotencyKeyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          findFirst: {
            args: Prisma.IdempotencyKeyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IdempotencyKeyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          findMany: {
            args: Prisma.IdempotencyKeyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[]
          }
          create: {
            args: Prisma.IdempotencyKeyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          createMany: {
            args: Prisma.IdempotencyKeyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IdempotencyKeyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[]
          }
          delete: {
            args: Prisma.IdempotencyKeyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          update: {
            args: Prisma.IdempotencyKeyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          deleteMany: {
            args: Prisma.IdempotencyKeyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IdempotencyKeyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>[]
          }
          upsert: {
            args: Prisma.IdempotencyKeyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IdempotencyKeyPayload>
          }
          aggregate: {
            args: Prisma.IdempotencyKeyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIdempotencyKey>
          }
          groupBy: {
            args: Prisma.IdempotencyKeyGroupByArgs<ExtArgs>
            result: $Utils.Optional<IdempotencyKeyGroupByOutputType>[]
          }
          count: {
            args: Prisma.IdempotencyKeyCountArgs<ExtArgs>
            result: $Utils.Optional<IdempotencyKeyCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    flavor?: FlavorOmit
    operator?: OperatorOmit
    lot?: LotOmit
    lotEvent?: LotEventOmit
    partner?: PartnerOmit
    shipment?: ShipmentOmit
    shipmentItem?: ShipmentItemOmit
    shipmentEvent?: ShipmentEventOmit
    appUser?: AppUserOmit
    auditLog?: AuditLogOmit
    idempotencyKey?: IdempotencyKeyOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type FlavorCountOutputType
   */

  export type FlavorCountOutputType = {
    lots: number
  }

  export type FlavorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lots?: boolean | FlavorCountOutputTypeCountLotsArgs
  }

  // Custom InputTypes
  /**
   * FlavorCountOutputType without action
   */
  export type FlavorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlavorCountOutputType
     */
    select?: FlavorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FlavorCountOutputType without action
   */
  export type FlavorCountOutputTypeCountLotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotWhereInput
  }


  /**
   * Count Type OperatorCountOutputType
   */

  export type OperatorCountOutputType = {
    lots: number
  }

  export type OperatorCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lots?: boolean | OperatorCountOutputTypeCountLotsArgs
  }

  // Custom InputTypes
  /**
   * OperatorCountOutputType without action
   */
  export type OperatorCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OperatorCountOutputType
     */
    select?: OperatorCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OperatorCountOutputType without action
   */
  export type OperatorCountOutputTypeCountLotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotWhereInput
  }


  /**
   * Count Type LotCountOutputType
   */

  export type LotCountOutputType = {
    events: number
    shipmentItems: number
  }

  export type LotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    events?: boolean | LotCountOutputTypeCountEventsArgs
    shipmentItems?: boolean | LotCountOutputTypeCountShipmentItemsArgs
  }

  // Custom InputTypes
  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotCountOutputType
     */
    select?: LotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotEventWhereInput
  }

  /**
   * LotCountOutputType without action
   */
  export type LotCountOutputTypeCountShipmentItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
  }


  /**
   * Count Type PartnerCountOutputType
   */

  export type PartnerCountOutputType = {
    shipments: number
    users: number
  }

  export type PartnerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipments?: boolean | PartnerCountOutputTypeCountShipmentsArgs
    users?: boolean | PartnerCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerCountOutputType
     */
    select?: PartnerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeCountShipmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentWhereInput
  }

  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppUserWhereInput
  }


  /**
   * Count Type ShipmentCountOutputType
   */

  export type ShipmentCountOutputType = {
    items: number
    events: number
  }

  export type ShipmentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | ShipmentCountOutputTypeCountItemsArgs
    events?: boolean | ShipmentCountOutputTypeCountEventsArgs
  }

  // Custom InputTypes
  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentCountOutputType
     */
    select?: ShipmentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
  }

  /**
   * ShipmentCountOutputType without action
   */
  export type ShipmentCountOutputTypeCountEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentEventWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Flavor
   */

  export type AggregateFlavor = {
    _count: FlavorCountAggregateOutputType | null
    _min: FlavorMinAggregateOutputType | null
    _max: FlavorMaxAggregateOutputType | null
  }

  export type FlavorMinAggregateOutputType = {
    code: string | null
    name: string | null
    active: boolean | null
    createdAt: Date | null
  }

  export type FlavorMaxAggregateOutputType = {
    code: string | null
    name: string | null
    active: boolean | null
    createdAt: Date | null
  }

  export type FlavorCountAggregateOutputType = {
    code: number
    name: number
    active: number
    createdAt: number
    _all: number
  }


  export type FlavorMinAggregateInputType = {
    code?: true
    name?: true
    active?: true
    createdAt?: true
  }

  export type FlavorMaxAggregateInputType = {
    code?: true
    name?: true
    active?: true
    createdAt?: true
  }

  export type FlavorCountAggregateInputType = {
    code?: true
    name?: true
    active?: true
    createdAt?: true
    _all?: true
  }

  export type FlavorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flavor to aggregate.
     */
    where?: FlavorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flavors to fetch.
     */
    orderBy?: FlavorOrderByWithRelationInput | FlavorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlavorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flavors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flavors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Flavors
    **/
    _count?: true | FlavorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlavorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlavorMaxAggregateInputType
  }

  export type GetFlavorAggregateType<T extends FlavorAggregateArgs> = {
        [P in keyof T & keyof AggregateFlavor]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlavor[P]>
      : GetScalarType<T[P], AggregateFlavor[P]>
  }




  export type FlavorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlavorWhereInput
    orderBy?: FlavorOrderByWithAggregationInput | FlavorOrderByWithAggregationInput[]
    by: FlavorScalarFieldEnum[] | FlavorScalarFieldEnum
    having?: FlavorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlavorCountAggregateInputType | true
    _min?: FlavorMinAggregateInputType
    _max?: FlavorMaxAggregateInputType
  }

  export type FlavorGroupByOutputType = {
    code: string
    name: string
    active: boolean
    createdAt: Date
    _count: FlavorCountAggregateOutputType | null
    _min: FlavorMinAggregateOutputType | null
    _max: FlavorMaxAggregateOutputType | null
  }

  type GetFlavorGroupByPayload<T extends FlavorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlavorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlavorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlavorGroupByOutputType[P]>
            : GetScalarType<T[P], FlavorGroupByOutputType[P]>
        }
      >
    >


  export type FlavorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    active?: boolean
    createdAt?: boolean
    lots?: boolean | Flavor$lotsArgs<ExtArgs>
    _count?: boolean | FlavorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flavor"]>

  export type FlavorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    active?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["flavor"]>

  export type FlavorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    code?: boolean
    name?: boolean
    active?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["flavor"]>

  export type FlavorSelectScalar = {
    code?: boolean
    name?: boolean
    active?: boolean
    createdAt?: boolean
  }

  export type FlavorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"code" | "name" | "active" | "createdAt", ExtArgs["result"]["flavor"]>
  export type FlavorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lots?: boolean | Flavor$lotsArgs<ExtArgs>
    _count?: boolean | FlavorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FlavorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FlavorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FlavorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Flavor"
    objects: {
      lots: Prisma.$LotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      code: string
      name: string
      active: boolean
      createdAt: Date
    }, ExtArgs["result"]["flavor"]>
    composites: {}
  }

  type FlavorGetPayload<S extends boolean | null | undefined | FlavorDefaultArgs> = $Result.GetResult<Prisma.$FlavorPayload, S>

  type FlavorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlavorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlavorCountAggregateInputType | true
    }

  export interface FlavorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Flavor'], meta: { name: 'Flavor' } }
    /**
     * Find zero or one Flavor that matches the filter.
     * @param {FlavorFindUniqueArgs} args - Arguments to find a Flavor
     * @example
     * // Get one Flavor
     * const flavor = await prisma.flavor.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlavorFindUniqueArgs>(args: SelectSubset<T, FlavorFindUniqueArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Flavor that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlavorFindUniqueOrThrowArgs} args - Arguments to find a Flavor
     * @example
     * // Get one Flavor
     * const flavor = await prisma.flavor.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlavorFindUniqueOrThrowArgs>(args: SelectSubset<T, FlavorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flavor that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorFindFirstArgs} args - Arguments to find a Flavor
     * @example
     * // Get one Flavor
     * const flavor = await prisma.flavor.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlavorFindFirstArgs>(args?: SelectSubset<T, FlavorFindFirstArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flavor that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorFindFirstOrThrowArgs} args - Arguments to find a Flavor
     * @example
     * // Get one Flavor
     * const flavor = await prisma.flavor.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlavorFindFirstOrThrowArgs>(args?: SelectSubset<T, FlavorFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Flavors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Flavors
     * const flavors = await prisma.flavor.findMany()
     * 
     * // Get first 10 Flavors
     * const flavors = await prisma.flavor.findMany({ take: 10 })
     * 
     * // Only select the `code`
     * const flavorWithCodeOnly = await prisma.flavor.findMany({ select: { code: true } })
     * 
     */
    findMany<T extends FlavorFindManyArgs>(args?: SelectSubset<T, FlavorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Flavor.
     * @param {FlavorCreateArgs} args - Arguments to create a Flavor.
     * @example
     * // Create one Flavor
     * const Flavor = await prisma.flavor.create({
     *   data: {
     *     // ... data to create a Flavor
     *   }
     * })
     * 
     */
    create<T extends FlavorCreateArgs>(args: SelectSubset<T, FlavorCreateArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Flavors.
     * @param {FlavorCreateManyArgs} args - Arguments to create many Flavors.
     * @example
     * // Create many Flavors
     * const flavor = await prisma.flavor.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlavorCreateManyArgs>(args?: SelectSubset<T, FlavorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Flavors and returns the data saved in the database.
     * @param {FlavorCreateManyAndReturnArgs} args - Arguments to create many Flavors.
     * @example
     * // Create many Flavors
     * const flavor = await prisma.flavor.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Flavors and only return the `code`
     * const flavorWithCodeOnly = await prisma.flavor.createManyAndReturn({
     *   select: { code: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlavorCreateManyAndReturnArgs>(args?: SelectSubset<T, FlavorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Flavor.
     * @param {FlavorDeleteArgs} args - Arguments to delete one Flavor.
     * @example
     * // Delete one Flavor
     * const Flavor = await prisma.flavor.delete({
     *   where: {
     *     // ... filter to delete one Flavor
     *   }
     * })
     * 
     */
    delete<T extends FlavorDeleteArgs>(args: SelectSubset<T, FlavorDeleteArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Flavor.
     * @param {FlavorUpdateArgs} args - Arguments to update one Flavor.
     * @example
     * // Update one Flavor
     * const flavor = await prisma.flavor.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlavorUpdateArgs>(args: SelectSubset<T, FlavorUpdateArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Flavors.
     * @param {FlavorDeleteManyArgs} args - Arguments to filter Flavors to delete.
     * @example
     * // Delete a few Flavors
     * const { count } = await prisma.flavor.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlavorDeleteManyArgs>(args?: SelectSubset<T, FlavorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flavors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Flavors
     * const flavor = await prisma.flavor.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlavorUpdateManyArgs>(args: SelectSubset<T, FlavorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flavors and returns the data updated in the database.
     * @param {FlavorUpdateManyAndReturnArgs} args - Arguments to update many Flavors.
     * @example
     * // Update many Flavors
     * const flavor = await prisma.flavor.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Flavors and only return the `code`
     * const flavorWithCodeOnly = await prisma.flavor.updateManyAndReturn({
     *   select: { code: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FlavorUpdateManyAndReturnArgs>(args: SelectSubset<T, FlavorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Flavor.
     * @param {FlavorUpsertArgs} args - Arguments to update or create a Flavor.
     * @example
     * // Update or create a Flavor
     * const flavor = await prisma.flavor.upsert({
     *   create: {
     *     // ... data to create a Flavor
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Flavor we want to update
     *   }
     * })
     */
    upsert<T extends FlavorUpsertArgs>(args: SelectSubset<T, FlavorUpsertArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Flavors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorCountArgs} args - Arguments to filter Flavors to count.
     * @example
     * // Count the number of Flavors
     * const count = await prisma.flavor.count({
     *   where: {
     *     // ... the filter for the Flavors we want to count
     *   }
     * })
    **/
    count<T extends FlavorCountArgs>(
      args?: Subset<T, FlavorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlavorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Flavor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FlavorAggregateArgs>(args: Subset<T, FlavorAggregateArgs>): Prisma.PrismaPromise<GetFlavorAggregateType<T>>

    /**
     * Group by Flavor.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlavorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FlavorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlavorGroupByArgs['orderBy'] }
        : { orderBy?: FlavorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FlavorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlavorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Flavor model
   */
  readonly fields: FlavorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Flavor.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlavorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lots<T extends Flavor$lotsArgs<ExtArgs> = {}>(args?: Subset<T, Flavor$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Flavor model
   */
  interface FlavorFieldRefs {
    readonly code: FieldRef<"Flavor", 'String'>
    readonly name: FieldRef<"Flavor", 'String'>
    readonly active: FieldRef<"Flavor", 'Boolean'>
    readonly createdAt: FieldRef<"Flavor", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Flavor findUnique
   */
  export type FlavorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * Filter, which Flavor to fetch.
     */
    where: FlavorWhereUniqueInput
  }

  /**
   * Flavor findUniqueOrThrow
   */
  export type FlavorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * Filter, which Flavor to fetch.
     */
    where: FlavorWhereUniqueInput
  }

  /**
   * Flavor findFirst
   */
  export type FlavorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * Filter, which Flavor to fetch.
     */
    where?: FlavorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flavors to fetch.
     */
    orderBy?: FlavorOrderByWithRelationInput | FlavorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flavors.
     */
    cursor?: FlavorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flavors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flavors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flavors.
     */
    distinct?: FlavorScalarFieldEnum | FlavorScalarFieldEnum[]
  }

  /**
   * Flavor findFirstOrThrow
   */
  export type FlavorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * Filter, which Flavor to fetch.
     */
    where?: FlavorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flavors to fetch.
     */
    orderBy?: FlavorOrderByWithRelationInput | FlavorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flavors.
     */
    cursor?: FlavorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flavors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flavors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flavors.
     */
    distinct?: FlavorScalarFieldEnum | FlavorScalarFieldEnum[]
  }

  /**
   * Flavor findMany
   */
  export type FlavorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * Filter, which Flavors to fetch.
     */
    where?: FlavorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flavors to fetch.
     */
    orderBy?: FlavorOrderByWithRelationInput | FlavorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Flavors.
     */
    cursor?: FlavorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flavors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flavors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flavors.
     */
    distinct?: FlavorScalarFieldEnum | FlavorScalarFieldEnum[]
  }

  /**
   * Flavor create
   */
  export type FlavorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * The data needed to create a Flavor.
     */
    data: XOR<FlavorCreateInput, FlavorUncheckedCreateInput>
  }

  /**
   * Flavor createMany
   */
  export type FlavorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Flavors.
     */
    data: FlavorCreateManyInput | FlavorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Flavor createManyAndReturn
   */
  export type FlavorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * The data used to create many Flavors.
     */
    data: FlavorCreateManyInput | FlavorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Flavor update
   */
  export type FlavorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * The data needed to update a Flavor.
     */
    data: XOR<FlavorUpdateInput, FlavorUncheckedUpdateInput>
    /**
     * Choose, which Flavor to update.
     */
    where: FlavorWhereUniqueInput
  }

  /**
   * Flavor updateMany
   */
  export type FlavorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Flavors.
     */
    data: XOR<FlavorUpdateManyMutationInput, FlavorUncheckedUpdateManyInput>
    /**
     * Filter which Flavors to update
     */
    where?: FlavorWhereInput
    /**
     * Limit how many Flavors to update.
     */
    limit?: number
  }

  /**
   * Flavor updateManyAndReturn
   */
  export type FlavorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * The data used to update Flavors.
     */
    data: XOR<FlavorUpdateManyMutationInput, FlavorUncheckedUpdateManyInput>
    /**
     * Filter which Flavors to update
     */
    where?: FlavorWhereInput
    /**
     * Limit how many Flavors to update.
     */
    limit?: number
  }

  /**
   * Flavor upsert
   */
  export type FlavorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * The filter to search for the Flavor to update in case it exists.
     */
    where: FlavorWhereUniqueInput
    /**
     * In case the Flavor found by the `where` argument doesn't exist, create a new Flavor with this data.
     */
    create: XOR<FlavorCreateInput, FlavorUncheckedCreateInput>
    /**
     * In case the Flavor was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlavorUpdateInput, FlavorUncheckedUpdateInput>
  }

  /**
   * Flavor delete
   */
  export type FlavorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
    /**
     * Filter which Flavor to delete.
     */
    where: FlavorWhereUniqueInput
  }

  /**
   * Flavor deleteMany
   */
  export type FlavorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flavors to delete
     */
    where?: FlavorWhereInput
    /**
     * Limit how many Flavors to delete.
     */
    limit?: number
  }

  /**
   * Flavor.lots
   */
  export type Flavor$lotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    where?: LotWhereInput
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    cursor?: LotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Flavor without action
   */
  export type FlavorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flavor
     */
    select?: FlavorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flavor
     */
    omit?: FlavorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlavorInclude<ExtArgs> | null
  }


  /**
   * Model Operator
   */

  export type AggregateOperator = {
    _count: OperatorCountAggregateOutputType | null
    _avg: OperatorAvgAggregateOutputType | null
    _sum: OperatorSumAggregateOutputType | null
    _min: OperatorMinAggregateOutputType | null
    _max: OperatorMaxAggregateOutputType | null
  }

  export type OperatorAvgAggregateOutputType = {
    id: number | null
    version: number | null
  }

  export type OperatorSumAggregateOutputType = {
    id: bigint | null
    version: number | null
  }

  export type OperatorMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    active: boolean | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type OperatorMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    active: boolean | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type OperatorCountAggregateOutputType = {
    id: number
    name: number
    active: number
    createdBy: number
    createdAt: number
    updatedAt: number
    version: number
    _all: number
  }


  export type OperatorAvgAggregateInputType = {
    id?: true
    version?: true
  }

  export type OperatorSumAggregateInputType = {
    id?: true
    version?: true
  }

  export type OperatorMinAggregateInputType = {
    id?: true
    name?: true
    active?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type OperatorMaxAggregateInputType = {
    id?: true
    name?: true
    active?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type OperatorCountAggregateInputType = {
    id?: true
    name?: true
    active?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
    _all?: true
  }

  export type OperatorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Operator to aggregate.
     */
    where?: OperatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Operators to fetch.
     */
    orderBy?: OperatorOrderByWithRelationInput | OperatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OperatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Operators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Operators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Operators
    **/
    _count?: true | OperatorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OperatorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OperatorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OperatorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OperatorMaxAggregateInputType
  }

  export type GetOperatorAggregateType<T extends OperatorAggregateArgs> = {
        [P in keyof T & keyof AggregateOperator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOperator[P]>
      : GetScalarType<T[P], AggregateOperator[P]>
  }




  export type OperatorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OperatorWhereInput
    orderBy?: OperatorOrderByWithAggregationInput | OperatorOrderByWithAggregationInput[]
    by: OperatorScalarFieldEnum[] | OperatorScalarFieldEnum
    having?: OperatorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OperatorCountAggregateInputType | true
    _avg?: OperatorAvgAggregateInputType
    _sum?: OperatorSumAggregateInputType
    _min?: OperatorMinAggregateInputType
    _max?: OperatorMaxAggregateInputType
  }

  export type OperatorGroupByOutputType = {
    id: bigint
    name: string
    active: boolean
    createdBy: string | null
    createdAt: Date
    updatedAt: Date
    version: number
    _count: OperatorCountAggregateOutputType | null
    _avg: OperatorAvgAggregateOutputType | null
    _sum: OperatorSumAggregateOutputType | null
    _min: OperatorMinAggregateOutputType | null
    _max: OperatorMaxAggregateOutputType | null
  }

  type GetOperatorGroupByPayload<T extends OperatorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OperatorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OperatorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OperatorGroupByOutputType[P]>
            : GetScalarType<T[P], OperatorGroupByOutputType[P]>
        }
      >
    >


  export type OperatorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    lots?: boolean | Operator$lotsArgs<ExtArgs>
    _count?: boolean | OperatorCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["operator"]>

  export type OperatorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }, ExtArgs["result"]["operator"]>

  export type OperatorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }, ExtArgs["result"]["operator"]>

  export type OperatorSelectScalar = {
    id?: boolean
    name?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }

  export type OperatorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "active" | "createdBy" | "createdAt" | "updatedAt" | "version", ExtArgs["result"]["operator"]>
  export type OperatorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lots?: boolean | Operator$lotsArgs<ExtArgs>
    _count?: boolean | OperatorCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OperatorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OperatorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OperatorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Operator"
    objects: {
      lots: Prisma.$LotPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      active: boolean
      createdBy: string | null
      createdAt: Date
      updatedAt: Date
      version: number
    }, ExtArgs["result"]["operator"]>
    composites: {}
  }

  type OperatorGetPayload<S extends boolean | null | undefined | OperatorDefaultArgs> = $Result.GetResult<Prisma.$OperatorPayload, S>

  type OperatorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OperatorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OperatorCountAggregateInputType | true
    }

  export interface OperatorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Operator'], meta: { name: 'Operator' } }
    /**
     * Find zero or one Operator that matches the filter.
     * @param {OperatorFindUniqueArgs} args - Arguments to find a Operator
     * @example
     * // Get one Operator
     * const operator = await prisma.operator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OperatorFindUniqueArgs>(args: SelectSubset<T, OperatorFindUniqueArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Operator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OperatorFindUniqueOrThrowArgs} args - Arguments to find a Operator
     * @example
     * // Get one Operator
     * const operator = await prisma.operator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OperatorFindUniqueOrThrowArgs>(args: SelectSubset<T, OperatorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Operator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorFindFirstArgs} args - Arguments to find a Operator
     * @example
     * // Get one Operator
     * const operator = await prisma.operator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OperatorFindFirstArgs>(args?: SelectSubset<T, OperatorFindFirstArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Operator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorFindFirstOrThrowArgs} args - Arguments to find a Operator
     * @example
     * // Get one Operator
     * const operator = await prisma.operator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OperatorFindFirstOrThrowArgs>(args?: SelectSubset<T, OperatorFindFirstOrThrowArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Operators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Operators
     * const operators = await prisma.operator.findMany()
     * 
     * // Get first 10 Operators
     * const operators = await prisma.operator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const operatorWithIdOnly = await prisma.operator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OperatorFindManyArgs>(args?: SelectSubset<T, OperatorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Operator.
     * @param {OperatorCreateArgs} args - Arguments to create a Operator.
     * @example
     * // Create one Operator
     * const Operator = await prisma.operator.create({
     *   data: {
     *     // ... data to create a Operator
     *   }
     * })
     * 
     */
    create<T extends OperatorCreateArgs>(args: SelectSubset<T, OperatorCreateArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Operators.
     * @param {OperatorCreateManyArgs} args - Arguments to create many Operators.
     * @example
     * // Create many Operators
     * const operator = await prisma.operator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OperatorCreateManyArgs>(args?: SelectSubset<T, OperatorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Operators and returns the data saved in the database.
     * @param {OperatorCreateManyAndReturnArgs} args - Arguments to create many Operators.
     * @example
     * // Create many Operators
     * const operator = await prisma.operator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Operators and only return the `id`
     * const operatorWithIdOnly = await prisma.operator.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OperatorCreateManyAndReturnArgs>(args?: SelectSubset<T, OperatorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Operator.
     * @param {OperatorDeleteArgs} args - Arguments to delete one Operator.
     * @example
     * // Delete one Operator
     * const Operator = await prisma.operator.delete({
     *   where: {
     *     // ... filter to delete one Operator
     *   }
     * })
     * 
     */
    delete<T extends OperatorDeleteArgs>(args: SelectSubset<T, OperatorDeleteArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Operator.
     * @param {OperatorUpdateArgs} args - Arguments to update one Operator.
     * @example
     * // Update one Operator
     * const operator = await prisma.operator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OperatorUpdateArgs>(args: SelectSubset<T, OperatorUpdateArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Operators.
     * @param {OperatorDeleteManyArgs} args - Arguments to filter Operators to delete.
     * @example
     * // Delete a few Operators
     * const { count } = await prisma.operator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OperatorDeleteManyArgs>(args?: SelectSubset<T, OperatorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Operators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Operators
     * const operator = await prisma.operator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OperatorUpdateManyArgs>(args: SelectSubset<T, OperatorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Operators and returns the data updated in the database.
     * @param {OperatorUpdateManyAndReturnArgs} args - Arguments to update many Operators.
     * @example
     * // Update many Operators
     * const operator = await prisma.operator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Operators and only return the `id`
     * const operatorWithIdOnly = await prisma.operator.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OperatorUpdateManyAndReturnArgs>(args: SelectSubset<T, OperatorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Operator.
     * @param {OperatorUpsertArgs} args - Arguments to update or create a Operator.
     * @example
     * // Update or create a Operator
     * const operator = await prisma.operator.upsert({
     *   create: {
     *     // ... data to create a Operator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Operator we want to update
     *   }
     * })
     */
    upsert<T extends OperatorUpsertArgs>(args: SelectSubset<T, OperatorUpsertArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Operators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorCountArgs} args - Arguments to filter Operators to count.
     * @example
     * // Count the number of Operators
     * const count = await prisma.operator.count({
     *   where: {
     *     // ... the filter for the Operators we want to count
     *   }
     * })
    **/
    count<T extends OperatorCountArgs>(
      args?: Subset<T, OperatorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OperatorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Operator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OperatorAggregateArgs>(args: Subset<T, OperatorAggregateArgs>): Prisma.PrismaPromise<GetOperatorAggregateType<T>>

    /**
     * Group by Operator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OperatorGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OperatorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OperatorGroupByArgs['orderBy'] }
        : { orderBy?: OperatorGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OperatorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOperatorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Operator model
   */
  readonly fields: OperatorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Operator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OperatorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lots<T extends Operator$lotsArgs<ExtArgs> = {}>(args?: Subset<T, Operator$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Operator model
   */
  interface OperatorFieldRefs {
    readonly id: FieldRef<"Operator", 'BigInt'>
    readonly name: FieldRef<"Operator", 'String'>
    readonly active: FieldRef<"Operator", 'Boolean'>
    readonly createdBy: FieldRef<"Operator", 'String'>
    readonly createdAt: FieldRef<"Operator", 'DateTime'>
    readonly updatedAt: FieldRef<"Operator", 'DateTime'>
    readonly version: FieldRef<"Operator", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Operator findUnique
   */
  export type OperatorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * Filter, which Operator to fetch.
     */
    where: OperatorWhereUniqueInput
  }

  /**
   * Operator findUniqueOrThrow
   */
  export type OperatorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * Filter, which Operator to fetch.
     */
    where: OperatorWhereUniqueInput
  }

  /**
   * Operator findFirst
   */
  export type OperatorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * Filter, which Operator to fetch.
     */
    where?: OperatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Operators to fetch.
     */
    orderBy?: OperatorOrderByWithRelationInput | OperatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Operators.
     */
    cursor?: OperatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Operators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Operators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Operators.
     */
    distinct?: OperatorScalarFieldEnum | OperatorScalarFieldEnum[]
  }

  /**
   * Operator findFirstOrThrow
   */
  export type OperatorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * Filter, which Operator to fetch.
     */
    where?: OperatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Operators to fetch.
     */
    orderBy?: OperatorOrderByWithRelationInput | OperatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Operators.
     */
    cursor?: OperatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Operators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Operators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Operators.
     */
    distinct?: OperatorScalarFieldEnum | OperatorScalarFieldEnum[]
  }

  /**
   * Operator findMany
   */
  export type OperatorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * Filter, which Operators to fetch.
     */
    where?: OperatorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Operators to fetch.
     */
    orderBy?: OperatorOrderByWithRelationInput | OperatorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Operators.
     */
    cursor?: OperatorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Operators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Operators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Operators.
     */
    distinct?: OperatorScalarFieldEnum | OperatorScalarFieldEnum[]
  }

  /**
   * Operator create
   */
  export type OperatorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * The data needed to create a Operator.
     */
    data: XOR<OperatorCreateInput, OperatorUncheckedCreateInput>
  }

  /**
   * Operator createMany
   */
  export type OperatorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Operators.
     */
    data: OperatorCreateManyInput | OperatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Operator createManyAndReturn
   */
  export type OperatorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * The data used to create many Operators.
     */
    data: OperatorCreateManyInput | OperatorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Operator update
   */
  export type OperatorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * The data needed to update a Operator.
     */
    data: XOR<OperatorUpdateInput, OperatorUncheckedUpdateInput>
    /**
     * Choose, which Operator to update.
     */
    where: OperatorWhereUniqueInput
  }

  /**
   * Operator updateMany
   */
  export type OperatorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Operators.
     */
    data: XOR<OperatorUpdateManyMutationInput, OperatorUncheckedUpdateManyInput>
    /**
     * Filter which Operators to update
     */
    where?: OperatorWhereInput
    /**
     * Limit how many Operators to update.
     */
    limit?: number
  }

  /**
   * Operator updateManyAndReturn
   */
  export type OperatorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * The data used to update Operators.
     */
    data: XOR<OperatorUpdateManyMutationInput, OperatorUncheckedUpdateManyInput>
    /**
     * Filter which Operators to update
     */
    where?: OperatorWhereInput
    /**
     * Limit how many Operators to update.
     */
    limit?: number
  }

  /**
   * Operator upsert
   */
  export type OperatorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * The filter to search for the Operator to update in case it exists.
     */
    where: OperatorWhereUniqueInput
    /**
     * In case the Operator found by the `where` argument doesn't exist, create a new Operator with this data.
     */
    create: XOR<OperatorCreateInput, OperatorUncheckedCreateInput>
    /**
     * In case the Operator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OperatorUpdateInput, OperatorUncheckedUpdateInput>
  }

  /**
   * Operator delete
   */
  export type OperatorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
    /**
     * Filter which Operator to delete.
     */
    where: OperatorWhereUniqueInput
  }

  /**
   * Operator deleteMany
   */
  export type OperatorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Operators to delete
     */
    where?: OperatorWhereInput
    /**
     * Limit how many Operators to delete.
     */
    limit?: number
  }

  /**
   * Operator.lots
   */
  export type Operator$lotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    where?: LotWhereInput
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    cursor?: LotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Operator without action
   */
  export type OperatorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Operator
     */
    select?: OperatorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Operator
     */
    omit?: OperatorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OperatorInclude<ExtArgs> | null
  }


  /**
   * Model Lot
   */

  export type AggregateLot = {
    _count: LotCountAggregateOutputType | null
    _avg: LotAvgAggregateOutputType | null
    _sum: LotSumAggregateOutputType | null
    _min: LotMinAggregateOutputType | null
    _max: LotMaxAggregateOutputType | null
  }

  export type LotAvgAggregateOutputType = {
    id: number | null
    sizeMl: number | null
    batchNo: number | null
    quantity: number | null
    operatorId: number | null
    version: number | null
  }

  export type LotSumAggregateOutputType = {
    id: bigint | null
    sizeMl: number | null
    batchNo: number | null
    quantity: number | null
    operatorId: bigint | null
    version: number | null
  }

  export type LotMinAggregateOutputType = {
    id: bigint | null
    lotNumber: string | null
    productionDate: Date | null
    productionPeriod: string | null
    flavorCode: string | null
    sizeMl: number | null
    batchNo: number | null
    quantity: number | null
    bestBefore: Date | null
    operatorId: bigint | null
    operatorName: string | null
    note: string | null
    status: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    voidReason: string | null
    voidedBy: string | null
    voidedAt: Date | null
    version: number | null
  }

  export type LotMaxAggregateOutputType = {
    id: bigint | null
    lotNumber: string | null
    productionDate: Date | null
    productionPeriod: string | null
    flavorCode: string | null
    sizeMl: number | null
    batchNo: number | null
    quantity: number | null
    bestBefore: Date | null
    operatorId: bigint | null
    operatorName: string | null
    note: string | null
    status: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    voidReason: string | null
    voidedBy: string | null
    voidedAt: Date | null
    version: number | null
  }

  export type LotCountAggregateOutputType = {
    id: number
    lotNumber: number
    productionDate: number
    productionPeriod: number
    flavorCode: number
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: number
    operatorId: number
    operatorName: number
    note: number
    status: number
    createdBy: number
    createdAt: number
    updatedAt: number
    voidReason: number
    voidedBy: number
    voidedAt: number
    version: number
    _all: number
  }


  export type LotAvgAggregateInputType = {
    id?: true
    sizeMl?: true
    batchNo?: true
    quantity?: true
    operatorId?: true
    version?: true
  }

  export type LotSumAggregateInputType = {
    id?: true
    sizeMl?: true
    batchNo?: true
    quantity?: true
    operatorId?: true
    version?: true
  }

  export type LotMinAggregateInputType = {
    id?: true
    lotNumber?: true
    productionDate?: true
    productionPeriod?: true
    flavorCode?: true
    sizeMl?: true
    batchNo?: true
    quantity?: true
    bestBefore?: true
    operatorId?: true
    operatorName?: true
    note?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    voidReason?: true
    voidedBy?: true
    voidedAt?: true
    version?: true
  }

  export type LotMaxAggregateInputType = {
    id?: true
    lotNumber?: true
    productionDate?: true
    productionPeriod?: true
    flavorCode?: true
    sizeMl?: true
    batchNo?: true
    quantity?: true
    bestBefore?: true
    operatorId?: true
    operatorName?: true
    note?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    voidReason?: true
    voidedBy?: true
    voidedAt?: true
    version?: true
  }

  export type LotCountAggregateInputType = {
    id?: true
    lotNumber?: true
    productionDate?: true
    productionPeriod?: true
    flavorCode?: true
    sizeMl?: true
    batchNo?: true
    quantity?: true
    bestBefore?: true
    operatorId?: true
    operatorName?: true
    note?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    voidReason?: true
    voidedBy?: true
    voidedAt?: true
    version?: true
    _all?: true
  }

  export type LotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lot to aggregate.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lots
    **/
    _count?: true | LotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LotMaxAggregateInputType
  }

  export type GetLotAggregateType<T extends LotAggregateArgs> = {
        [P in keyof T & keyof AggregateLot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLot[P]>
      : GetScalarType<T[P], AggregateLot[P]>
  }




  export type LotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotWhereInput
    orderBy?: LotOrderByWithAggregationInput | LotOrderByWithAggregationInput[]
    by: LotScalarFieldEnum[] | LotScalarFieldEnum
    having?: LotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LotCountAggregateInputType | true
    _avg?: LotAvgAggregateInputType
    _sum?: LotSumAggregateInputType
    _min?: LotMinAggregateInputType
    _max?: LotMaxAggregateInputType
  }

  export type LotGroupByOutputType = {
    id: bigint
    lotNumber: string
    productionDate: Date
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date
    operatorId: bigint
    operatorName: string
    note: string | null
    status: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
    voidReason: string | null
    voidedBy: string | null
    voidedAt: Date | null
    version: number
    _count: LotCountAggregateOutputType | null
    _avg: LotAvgAggregateOutputType | null
    _sum: LotSumAggregateOutputType | null
    _min: LotMinAggregateOutputType | null
    _max: LotMaxAggregateOutputType | null
  }

  type GetLotGroupByPayload<T extends LotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LotGroupByOutputType[P]>
            : GetScalarType<T[P], LotGroupByOutputType[P]>
        }
      >
    >


  export type LotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotNumber?: boolean
    productionDate?: boolean
    productionPeriod?: boolean
    flavorCode?: boolean
    sizeMl?: boolean
    batchNo?: boolean
    quantity?: boolean
    bestBefore?: boolean
    operatorId?: boolean
    operatorName?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    voidReason?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    version?: boolean
    flavor?: boolean | FlavorDefaultArgs<ExtArgs>
    operator?: boolean | OperatorDefaultArgs<ExtArgs>
    events?: boolean | Lot$eventsArgs<ExtArgs>
    shipmentItems?: boolean | Lot$shipmentItemsArgs<ExtArgs>
    _count?: boolean | LotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type LotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotNumber?: boolean
    productionDate?: boolean
    productionPeriod?: boolean
    flavorCode?: boolean
    sizeMl?: boolean
    batchNo?: boolean
    quantity?: boolean
    bestBefore?: boolean
    operatorId?: boolean
    operatorName?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    voidReason?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    version?: boolean
    flavor?: boolean | FlavorDefaultArgs<ExtArgs>
    operator?: boolean | OperatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type LotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotNumber?: boolean
    productionDate?: boolean
    productionPeriod?: boolean
    flavorCode?: boolean
    sizeMl?: boolean
    batchNo?: boolean
    quantity?: boolean
    bestBefore?: boolean
    operatorId?: boolean
    operatorName?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    voidReason?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    version?: boolean
    flavor?: boolean | FlavorDefaultArgs<ExtArgs>
    operator?: boolean | OperatorDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lot"]>

  export type LotSelectScalar = {
    id?: boolean
    lotNumber?: boolean
    productionDate?: boolean
    productionPeriod?: boolean
    flavorCode?: boolean
    sizeMl?: boolean
    batchNo?: boolean
    quantity?: boolean
    bestBefore?: boolean
    operatorId?: boolean
    operatorName?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    voidReason?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    version?: boolean
  }

  export type LotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lotNumber" | "productionDate" | "productionPeriod" | "flavorCode" | "sizeMl" | "batchNo" | "quantity" | "bestBefore" | "operatorId" | "operatorName" | "note" | "status" | "createdBy" | "createdAt" | "updatedAt" | "voidReason" | "voidedBy" | "voidedAt" | "version", ExtArgs["result"]["lot"]>
  export type LotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flavor?: boolean | FlavorDefaultArgs<ExtArgs>
    operator?: boolean | OperatorDefaultArgs<ExtArgs>
    events?: boolean | Lot$eventsArgs<ExtArgs>
    shipmentItems?: boolean | Lot$shipmentItemsArgs<ExtArgs>
    _count?: boolean | LotCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flavor?: boolean | FlavorDefaultArgs<ExtArgs>
    operator?: boolean | OperatorDefaultArgs<ExtArgs>
  }
  export type LotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flavor?: boolean | FlavorDefaultArgs<ExtArgs>
    operator?: boolean | OperatorDefaultArgs<ExtArgs>
  }

  export type $LotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lot"
    objects: {
      flavor: Prisma.$FlavorPayload<ExtArgs>
      operator: Prisma.$OperatorPayload<ExtArgs>
      events: Prisma.$LotEventPayload<ExtArgs>[]
      shipmentItems: Prisma.$ShipmentItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      lotNumber: string
      productionDate: Date
      productionPeriod: string
      flavorCode: string
      sizeMl: number
      batchNo: number
      quantity: number
      bestBefore: Date
      operatorId: bigint
      operatorName: string
      note: string | null
      status: string
      createdBy: string
      createdAt: Date
      updatedAt: Date
      voidReason: string | null
      voidedBy: string | null
      voidedAt: Date | null
      version: number
    }, ExtArgs["result"]["lot"]>
    composites: {}
  }

  type LotGetPayload<S extends boolean | null | undefined | LotDefaultArgs> = $Result.GetResult<Prisma.$LotPayload, S>

  type LotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LotCountAggregateInputType | true
    }

  export interface LotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lot'], meta: { name: 'Lot' } }
    /**
     * Find zero or one Lot that matches the filter.
     * @param {LotFindUniqueArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LotFindUniqueArgs>(args: SelectSubset<T, LotFindUniqueArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LotFindUniqueOrThrowArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LotFindUniqueOrThrowArgs>(args: SelectSubset<T, LotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotFindFirstArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LotFindFirstArgs>(args?: SelectSubset<T, LotFindFirstArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotFindFirstOrThrowArgs} args - Arguments to find a Lot
     * @example
     * // Get one Lot
     * const lot = await prisma.lot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LotFindFirstOrThrowArgs>(args?: SelectSubset<T, LotFindFirstOrThrowArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lots
     * const lots = await prisma.lot.findMany()
     * 
     * // Get first 10 Lots
     * const lots = await prisma.lot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lotWithIdOnly = await prisma.lot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LotFindManyArgs>(args?: SelectSubset<T, LotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lot.
     * @param {LotCreateArgs} args - Arguments to create a Lot.
     * @example
     * // Create one Lot
     * const Lot = await prisma.lot.create({
     *   data: {
     *     // ... data to create a Lot
     *   }
     * })
     * 
     */
    create<T extends LotCreateArgs>(args: SelectSubset<T, LotCreateArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lots.
     * @param {LotCreateManyArgs} args - Arguments to create many Lots.
     * @example
     * // Create many Lots
     * const lot = await prisma.lot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LotCreateManyArgs>(args?: SelectSubset<T, LotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lots and returns the data saved in the database.
     * @param {LotCreateManyAndReturnArgs} args - Arguments to create many Lots.
     * @example
     * // Create many Lots
     * const lot = await prisma.lot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lots and only return the `id`
     * const lotWithIdOnly = await prisma.lot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LotCreateManyAndReturnArgs>(args?: SelectSubset<T, LotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lot.
     * @param {LotDeleteArgs} args - Arguments to delete one Lot.
     * @example
     * // Delete one Lot
     * const Lot = await prisma.lot.delete({
     *   where: {
     *     // ... filter to delete one Lot
     *   }
     * })
     * 
     */
    delete<T extends LotDeleteArgs>(args: SelectSubset<T, LotDeleteArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lot.
     * @param {LotUpdateArgs} args - Arguments to update one Lot.
     * @example
     * // Update one Lot
     * const lot = await prisma.lot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LotUpdateArgs>(args: SelectSubset<T, LotUpdateArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lots.
     * @param {LotDeleteManyArgs} args - Arguments to filter Lots to delete.
     * @example
     * // Delete a few Lots
     * const { count } = await prisma.lot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LotDeleteManyArgs>(args?: SelectSubset<T, LotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lots
     * const lot = await prisma.lot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LotUpdateManyArgs>(args: SelectSubset<T, LotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lots and returns the data updated in the database.
     * @param {LotUpdateManyAndReturnArgs} args - Arguments to update many Lots.
     * @example
     * // Update many Lots
     * const lot = await prisma.lot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lots and only return the `id`
     * const lotWithIdOnly = await prisma.lot.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LotUpdateManyAndReturnArgs>(args: SelectSubset<T, LotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lot.
     * @param {LotUpsertArgs} args - Arguments to update or create a Lot.
     * @example
     * // Update or create a Lot
     * const lot = await prisma.lot.upsert({
     *   create: {
     *     // ... data to create a Lot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lot we want to update
     *   }
     * })
     */
    upsert<T extends LotUpsertArgs>(args: SelectSubset<T, LotUpsertArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotCountArgs} args - Arguments to filter Lots to count.
     * @example
     * // Count the number of Lots
     * const count = await prisma.lot.count({
     *   where: {
     *     // ... the filter for the Lots we want to count
     *   }
     * })
    **/
    count<T extends LotCountArgs>(
      args?: Subset<T, LotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LotAggregateArgs>(args: Subset<T, LotAggregateArgs>): Prisma.PrismaPromise<GetLotAggregateType<T>>

    /**
     * Group by Lot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LotGroupByArgs['orderBy'] }
        : { orderBy?: LotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lot model
   */
  readonly fields: LotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    flavor<T extends FlavorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlavorDefaultArgs<ExtArgs>>): Prisma__FlavorClient<$Result.GetResult<Prisma.$FlavorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    operator<T extends OperatorDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OperatorDefaultArgs<ExtArgs>>): Prisma__OperatorClient<$Result.GetResult<Prisma.$OperatorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    events<T extends Lot$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Lot$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    shipmentItems<T extends Lot$shipmentItemsArgs<ExtArgs> = {}>(args?: Subset<T, Lot$shipmentItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lot model
   */
  interface LotFieldRefs {
    readonly id: FieldRef<"Lot", 'BigInt'>
    readonly lotNumber: FieldRef<"Lot", 'String'>
    readonly productionDate: FieldRef<"Lot", 'DateTime'>
    readonly productionPeriod: FieldRef<"Lot", 'String'>
    readonly flavorCode: FieldRef<"Lot", 'String'>
    readonly sizeMl: FieldRef<"Lot", 'Int'>
    readonly batchNo: FieldRef<"Lot", 'Int'>
    readonly quantity: FieldRef<"Lot", 'Int'>
    readonly bestBefore: FieldRef<"Lot", 'DateTime'>
    readonly operatorId: FieldRef<"Lot", 'BigInt'>
    readonly operatorName: FieldRef<"Lot", 'String'>
    readonly note: FieldRef<"Lot", 'String'>
    readonly status: FieldRef<"Lot", 'String'>
    readonly createdBy: FieldRef<"Lot", 'String'>
    readonly createdAt: FieldRef<"Lot", 'DateTime'>
    readonly updatedAt: FieldRef<"Lot", 'DateTime'>
    readonly voidReason: FieldRef<"Lot", 'String'>
    readonly voidedBy: FieldRef<"Lot", 'String'>
    readonly voidedAt: FieldRef<"Lot", 'DateTime'>
    readonly version: FieldRef<"Lot", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Lot findUnique
   */
  export type LotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot findUniqueOrThrow
   */
  export type LotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot findFirst
   */
  export type LotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lots.
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Lot findFirstOrThrow
   */
  export type LotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lot to fetch.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lots.
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Lot findMany
   */
  export type LotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter, which Lots to fetch.
     */
    where?: LotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lots to fetch.
     */
    orderBy?: LotOrderByWithRelationInput | LotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lots.
     */
    cursor?: LotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lots.
     */
    distinct?: LotScalarFieldEnum | LotScalarFieldEnum[]
  }

  /**
   * Lot create
   */
  export type LotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * The data needed to create a Lot.
     */
    data: XOR<LotCreateInput, LotUncheckedCreateInput>
  }

  /**
   * Lot createMany
   */
  export type LotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lots.
     */
    data: LotCreateManyInput | LotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lot createManyAndReturn
   */
  export type LotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * The data used to create many Lots.
     */
    data: LotCreateManyInput | LotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lot update
   */
  export type LotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * The data needed to update a Lot.
     */
    data: XOR<LotUpdateInput, LotUncheckedUpdateInput>
    /**
     * Choose, which Lot to update.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot updateMany
   */
  export type LotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lots.
     */
    data: XOR<LotUpdateManyMutationInput, LotUncheckedUpdateManyInput>
    /**
     * Filter which Lots to update
     */
    where?: LotWhereInput
    /**
     * Limit how many Lots to update.
     */
    limit?: number
  }

  /**
   * Lot updateManyAndReturn
   */
  export type LotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * The data used to update Lots.
     */
    data: XOR<LotUpdateManyMutationInput, LotUncheckedUpdateManyInput>
    /**
     * Filter which Lots to update
     */
    where?: LotWhereInput
    /**
     * Limit how many Lots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Lot upsert
   */
  export type LotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * The filter to search for the Lot to update in case it exists.
     */
    where: LotWhereUniqueInput
    /**
     * In case the Lot found by the `where` argument doesn't exist, create a new Lot with this data.
     */
    create: XOR<LotCreateInput, LotUncheckedCreateInput>
    /**
     * In case the Lot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LotUpdateInput, LotUncheckedUpdateInput>
  }

  /**
   * Lot delete
   */
  export type LotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
    /**
     * Filter which Lot to delete.
     */
    where: LotWhereUniqueInput
  }

  /**
   * Lot deleteMany
   */
  export type LotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lots to delete
     */
    where?: LotWhereInput
    /**
     * Limit how many Lots to delete.
     */
    limit?: number
  }

  /**
   * Lot.events
   */
  export type Lot$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    where?: LotEventWhereInput
    orderBy?: LotEventOrderByWithRelationInput | LotEventOrderByWithRelationInput[]
    cursor?: LotEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LotEventScalarFieldEnum | LotEventScalarFieldEnum[]
  }

  /**
   * Lot.shipmentItems
   */
  export type Lot$shipmentItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    cursor?: ShipmentItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * Lot without action
   */
  export type LotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lot
     */
    select?: LotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lot
     */
    omit?: LotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotInclude<ExtArgs> | null
  }


  /**
   * Model LotEvent
   */

  export type AggregateLotEvent = {
    _count: LotEventCountAggregateOutputType | null
    _avg: LotEventAvgAggregateOutputType | null
    _sum: LotEventSumAggregateOutputType | null
    _min: LotEventMinAggregateOutputType | null
    _max: LotEventMaxAggregateOutputType | null
  }

  export type LotEventAvgAggregateOutputType = {
    id: number | null
    lotId: number | null
  }

  export type LotEventSumAggregateOutputType = {
    id: bigint | null
    lotId: bigint | null
  }

  export type LotEventMinAggregateOutputType = {
    id: bigint | null
    lotId: bigint | null
    eventType: string | null
    reason: string | null
    actorUserId: string | null
    createdAt: Date | null
  }

  export type LotEventMaxAggregateOutputType = {
    id: bigint | null
    lotId: bigint | null
    eventType: string | null
    reason: string | null
    actorUserId: string | null
    createdAt: Date | null
  }

  export type LotEventCountAggregateOutputType = {
    id: number
    lotId: number
    eventType: number
    reason: number
    actorUserId: number
    snapshot: number
    createdAt: number
    _all: number
  }


  export type LotEventAvgAggregateInputType = {
    id?: true
    lotId?: true
  }

  export type LotEventSumAggregateInputType = {
    id?: true
    lotId?: true
  }

  export type LotEventMinAggregateInputType = {
    id?: true
    lotId?: true
    eventType?: true
    reason?: true
    actorUserId?: true
    createdAt?: true
  }

  export type LotEventMaxAggregateInputType = {
    id?: true
    lotId?: true
    eventType?: true
    reason?: true
    actorUserId?: true
    createdAt?: true
  }

  export type LotEventCountAggregateInputType = {
    id?: true
    lotId?: true
    eventType?: true
    reason?: true
    actorUserId?: true
    snapshot?: true
    createdAt?: true
    _all?: true
  }

  export type LotEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LotEvent to aggregate.
     */
    where?: LotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotEvents to fetch.
     */
    orderBy?: LotEventOrderByWithRelationInput | LotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LotEvents
    **/
    _count?: true | LotEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LotEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LotEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LotEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LotEventMaxAggregateInputType
  }

  export type GetLotEventAggregateType<T extends LotEventAggregateArgs> = {
        [P in keyof T & keyof AggregateLotEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLotEvent[P]>
      : GetScalarType<T[P], AggregateLotEvent[P]>
  }




  export type LotEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LotEventWhereInput
    orderBy?: LotEventOrderByWithAggregationInput | LotEventOrderByWithAggregationInput[]
    by: LotEventScalarFieldEnum[] | LotEventScalarFieldEnum
    having?: LotEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LotEventCountAggregateInputType | true
    _avg?: LotEventAvgAggregateInputType
    _sum?: LotEventSumAggregateInputType
    _min?: LotEventMinAggregateInputType
    _max?: LotEventMaxAggregateInputType
  }

  export type LotEventGroupByOutputType = {
    id: bigint
    lotId: bigint
    eventType: string
    reason: string | null
    actorUserId: string | null
    snapshot: JsonValue
    createdAt: Date
    _count: LotEventCountAggregateOutputType | null
    _avg: LotEventAvgAggregateOutputType | null
    _sum: LotEventSumAggregateOutputType | null
    _min: LotEventMinAggregateOutputType | null
    _max: LotEventMaxAggregateOutputType | null
  }

  type GetLotEventGroupByPayload<T extends LotEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LotEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LotEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LotEventGroupByOutputType[P]>
            : GetScalarType<T[P], LotEventGroupByOutputType[P]>
        }
      >
    >


  export type LotEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lotEvent"]>

  export type LotEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lotEvent"]>

  export type LotEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lotId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lotEvent"]>

  export type LotEventSelectScalar = {
    id?: boolean
    lotId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
  }

  export type LotEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lotId" | "eventType" | "reason" | "actorUserId" | "snapshot" | "createdAt", ExtArgs["result"]["lotEvent"]>
  export type LotEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type LotEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type LotEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }

  export type $LotEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LotEvent"
    objects: {
      lot: Prisma.$LotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      lotId: bigint
      eventType: string
      reason: string | null
      actorUserId: string | null
      snapshot: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["lotEvent"]>
    composites: {}
  }

  type LotEventGetPayload<S extends boolean | null | undefined | LotEventDefaultArgs> = $Result.GetResult<Prisma.$LotEventPayload, S>

  type LotEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LotEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LotEventCountAggregateInputType | true
    }

  export interface LotEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LotEvent'], meta: { name: 'LotEvent' } }
    /**
     * Find zero or one LotEvent that matches the filter.
     * @param {LotEventFindUniqueArgs} args - Arguments to find a LotEvent
     * @example
     * // Get one LotEvent
     * const lotEvent = await prisma.lotEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LotEventFindUniqueArgs>(args: SelectSubset<T, LotEventFindUniqueArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LotEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LotEventFindUniqueOrThrowArgs} args - Arguments to find a LotEvent
     * @example
     * // Get one LotEvent
     * const lotEvent = await prisma.lotEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LotEventFindUniqueOrThrowArgs>(args: SelectSubset<T, LotEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LotEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventFindFirstArgs} args - Arguments to find a LotEvent
     * @example
     * // Get one LotEvent
     * const lotEvent = await prisma.lotEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LotEventFindFirstArgs>(args?: SelectSubset<T, LotEventFindFirstArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LotEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventFindFirstOrThrowArgs} args - Arguments to find a LotEvent
     * @example
     * // Get one LotEvent
     * const lotEvent = await prisma.lotEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LotEventFindFirstOrThrowArgs>(args?: SelectSubset<T, LotEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LotEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LotEvents
     * const lotEvents = await prisma.lotEvent.findMany()
     * 
     * // Get first 10 LotEvents
     * const lotEvents = await prisma.lotEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lotEventWithIdOnly = await prisma.lotEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LotEventFindManyArgs>(args?: SelectSubset<T, LotEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LotEvent.
     * @param {LotEventCreateArgs} args - Arguments to create a LotEvent.
     * @example
     * // Create one LotEvent
     * const LotEvent = await prisma.lotEvent.create({
     *   data: {
     *     // ... data to create a LotEvent
     *   }
     * })
     * 
     */
    create<T extends LotEventCreateArgs>(args: SelectSubset<T, LotEventCreateArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LotEvents.
     * @param {LotEventCreateManyArgs} args - Arguments to create many LotEvents.
     * @example
     * // Create many LotEvents
     * const lotEvent = await prisma.lotEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LotEventCreateManyArgs>(args?: SelectSubset<T, LotEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LotEvents and returns the data saved in the database.
     * @param {LotEventCreateManyAndReturnArgs} args - Arguments to create many LotEvents.
     * @example
     * // Create many LotEvents
     * const lotEvent = await prisma.lotEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LotEvents and only return the `id`
     * const lotEventWithIdOnly = await prisma.lotEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LotEventCreateManyAndReturnArgs>(args?: SelectSubset<T, LotEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LotEvent.
     * @param {LotEventDeleteArgs} args - Arguments to delete one LotEvent.
     * @example
     * // Delete one LotEvent
     * const LotEvent = await prisma.lotEvent.delete({
     *   where: {
     *     // ... filter to delete one LotEvent
     *   }
     * })
     * 
     */
    delete<T extends LotEventDeleteArgs>(args: SelectSubset<T, LotEventDeleteArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LotEvent.
     * @param {LotEventUpdateArgs} args - Arguments to update one LotEvent.
     * @example
     * // Update one LotEvent
     * const lotEvent = await prisma.lotEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LotEventUpdateArgs>(args: SelectSubset<T, LotEventUpdateArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LotEvents.
     * @param {LotEventDeleteManyArgs} args - Arguments to filter LotEvents to delete.
     * @example
     * // Delete a few LotEvents
     * const { count } = await prisma.lotEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LotEventDeleteManyArgs>(args?: SelectSubset<T, LotEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LotEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LotEvents
     * const lotEvent = await prisma.lotEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LotEventUpdateManyArgs>(args: SelectSubset<T, LotEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LotEvents and returns the data updated in the database.
     * @param {LotEventUpdateManyAndReturnArgs} args - Arguments to update many LotEvents.
     * @example
     * // Update many LotEvents
     * const lotEvent = await prisma.lotEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LotEvents and only return the `id`
     * const lotEventWithIdOnly = await prisma.lotEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LotEventUpdateManyAndReturnArgs>(args: SelectSubset<T, LotEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LotEvent.
     * @param {LotEventUpsertArgs} args - Arguments to update or create a LotEvent.
     * @example
     * // Update or create a LotEvent
     * const lotEvent = await prisma.lotEvent.upsert({
     *   create: {
     *     // ... data to create a LotEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LotEvent we want to update
     *   }
     * })
     */
    upsert<T extends LotEventUpsertArgs>(args: SelectSubset<T, LotEventUpsertArgs<ExtArgs>>): Prisma__LotEventClient<$Result.GetResult<Prisma.$LotEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LotEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventCountArgs} args - Arguments to filter LotEvents to count.
     * @example
     * // Count the number of LotEvents
     * const count = await prisma.lotEvent.count({
     *   where: {
     *     // ... the filter for the LotEvents we want to count
     *   }
     * })
    **/
    count<T extends LotEventCountArgs>(
      args?: Subset<T, LotEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LotEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LotEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LotEventAggregateArgs>(args: Subset<T, LotEventAggregateArgs>): Prisma.PrismaPromise<GetLotEventAggregateType<T>>

    /**
     * Group by LotEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LotEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LotEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LotEventGroupByArgs['orderBy'] }
        : { orderBy?: LotEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LotEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLotEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LotEvent model
   */
  readonly fields: LotEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LotEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LotEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lot<T extends LotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LotDefaultArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LotEvent model
   */
  interface LotEventFieldRefs {
    readonly id: FieldRef<"LotEvent", 'BigInt'>
    readonly lotId: FieldRef<"LotEvent", 'BigInt'>
    readonly eventType: FieldRef<"LotEvent", 'String'>
    readonly reason: FieldRef<"LotEvent", 'String'>
    readonly actorUserId: FieldRef<"LotEvent", 'String'>
    readonly snapshot: FieldRef<"LotEvent", 'Json'>
    readonly createdAt: FieldRef<"LotEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LotEvent findUnique
   */
  export type LotEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * Filter, which LotEvent to fetch.
     */
    where: LotEventWhereUniqueInput
  }

  /**
   * LotEvent findUniqueOrThrow
   */
  export type LotEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * Filter, which LotEvent to fetch.
     */
    where: LotEventWhereUniqueInput
  }

  /**
   * LotEvent findFirst
   */
  export type LotEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * Filter, which LotEvent to fetch.
     */
    where?: LotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotEvents to fetch.
     */
    orderBy?: LotEventOrderByWithRelationInput | LotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LotEvents.
     */
    cursor?: LotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LotEvents.
     */
    distinct?: LotEventScalarFieldEnum | LotEventScalarFieldEnum[]
  }

  /**
   * LotEvent findFirstOrThrow
   */
  export type LotEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * Filter, which LotEvent to fetch.
     */
    where?: LotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotEvents to fetch.
     */
    orderBy?: LotEventOrderByWithRelationInput | LotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LotEvents.
     */
    cursor?: LotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LotEvents.
     */
    distinct?: LotEventScalarFieldEnum | LotEventScalarFieldEnum[]
  }

  /**
   * LotEvent findMany
   */
  export type LotEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * Filter, which LotEvents to fetch.
     */
    where?: LotEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LotEvents to fetch.
     */
    orderBy?: LotEventOrderByWithRelationInput | LotEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LotEvents.
     */
    cursor?: LotEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LotEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LotEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LotEvents.
     */
    distinct?: LotEventScalarFieldEnum | LotEventScalarFieldEnum[]
  }

  /**
   * LotEvent create
   */
  export type LotEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * The data needed to create a LotEvent.
     */
    data: XOR<LotEventCreateInput, LotEventUncheckedCreateInput>
  }

  /**
   * LotEvent createMany
   */
  export type LotEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LotEvents.
     */
    data: LotEventCreateManyInput | LotEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LotEvent createManyAndReturn
   */
  export type LotEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * The data used to create many LotEvents.
     */
    data: LotEventCreateManyInput | LotEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LotEvent update
   */
  export type LotEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * The data needed to update a LotEvent.
     */
    data: XOR<LotEventUpdateInput, LotEventUncheckedUpdateInput>
    /**
     * Choose, which LotEvent to update.
     */
    where: LotEventWhereUniqueInput
  }

  /**
   * LotEvent updateMany
   */
  export type LotEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LotEvents.
     */
    data: XOR<LotEventUpdateManyMutationInput, LotEventUncheckedUpdateManyInput>
    /**
     * Filter which LotEvents to update
     */
    where?: LotEventWhereInput
    /**
     * Limit how many LotEvents to update.
     */
    limit?: number
  }

  /**
   * LotEvent updateManyAndReturn
   */
  export type LotEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * The data used to update LotEvents.
     */
    data: XOR<LotEventUpdateManyMutationInput, LotEventUncheckedUpdateManyInput>
    /**
     * Filter which LotEvents to update
     */
    where?: LotEventWhereInput
    /**
     * Limit how many LotEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LotEvent upsert
   */
  export type LotEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * The filter to search for the LotEvent to update in case it exists.
     */
    where: LotEventWhereUniqueInput
    /**
     * In case the LotEvent found by the `where` argument doesn't exist, create a new LotEvent with this data.
     */
    create: XOR<LotEventCreateInput, LotEventUncheckedCreateInput>
    /**
     * In case the LotEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LotEventUpdateInput, LotEventUncheckedUpdateInput>
  }

  /**
   * LotEvent delete
   */
  export type LotEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
    /**
     * Filter which LotEvent to delete.
     */
    where: LotEventWhereUniqueInput
  }

  /**
   * LotEvent deleteMany
   */
  export type LotEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LotEvents to delete
     */
    where?: LotEventWhereInput
    /**
     * Limit how many LotEvents to delete.
     */
    limit?: number
  }

  /**
   * LotEvent without action
   */
  export type LotEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LotEvent
     */
    select?: LotEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LotEvent
     */
    omit?: LotEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LotEventInclude<ExtArgs> | null
  }


  /**
   * Model Partner
   */

  export type AggregatePartner = {
    _count: PartnerCountAggregateOutputType | null
    _avg: PartnerAvgAggregateOutputType | null
    _sum: PartnerSumAggregateOutputType | null
    _min: PartnerMinAggregateOutputType | null
    _max: PartnerMaxAggregateOutputType | null
  }

  export type PartnerAvgAggregateOutputType = {
    id: number | null
    version: number | null
  }

  export type PartnerSumAggregateOutputType = {
    id: bigint | null
    version: number | null
  }

  export type PartnerMinAggregateOutputType = {
    id: bigint | null
    name: string | null
    billingName: string | null
    taxNumber: string | null
    shippingAddress: string | null
    contactName: string | null
    email: string | null
    phone: string | null
    note: string | null
    active: boolean | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type PartnerMaxAggregateOutputType = {
    id: bigint | null
    name: string | null
    billingName: string | null
    taxNumber: string | null
    shippingAddress: string | null
    contactName: string | null
    email: string | null
    phone: string | null
    note: string | null
    active: boolean | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type PartnerCountAggregateOutputType = {
    id: number
    name: number
    billingName: number
    taxNumber: number
    shippingAddress: number
    contactName: number
    email: number
    phone: number
    note: number
    active: number
    createdBy: number
    createdAt: number
    updatedAt: number
    version: number
    _all: number
  }


  export type PartnerAvgAggregateInputType = {
    id?: true
    version?: true
  }

  export type PartnerSumAggregateInputType = {
    id?: true
    version?: true
  }

  export type PartnerMinAggregateInputType = {
    id?: true
    name?: true
    billingName?: true
    taxNumber?: true
    shippingAddress?: true
    contactName?: true
    email?: true
    phone?: true
    note?: true
    active?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type PartnerMaxAggregateInputType = {
    id?: true
    name?: true
    billingName?: true
    taxNumber?: true
    shippingAddress?: true
    contactName?: true
    email?: true
    phone?: true
    note?: true
    active?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type PartnerCountAggregateInputType = {
    id?: true
    name?: true
    billingName?: true
    taxNumber?: true
    shippingAddress?: true
    contactName?: true
    email?: true
    phone?: true
    note?: true
    active?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
    _all?: true
  }

  export type PartnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Partner to aggregate.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Partners
    **/
    _count?: true | PartnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PartnerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PartnerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PartnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PartnerMaxAggregateInputType
  }

  export type GetPartnerAggregateType<T extends PartnerAggregateArgs> = {
        [P in keyof T & keyof AggregatePartner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePartner[P]>
      : GetScalarType<T[P], AggregatePartner[P]>
  }




  export type PartnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartnerWhereInput
    orderBy?: PartnerOrderByWithAggregationInput | PartnerOrderByWithAggregationInput[]
    by: PartnerScalarFieldEnum[] | PartnerScalarFieldEnum
    having?: PartnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PartnerCountAggregateInputType | true
    _avg?: PartnerAvgAggregateInputType
    _sum?: PartnerSumAggregateInputType
    _min?: PartnerMinAggregateInputType
    _max?: PartnerMaxAggregateInputType
  }

  export type PartnerGroupByOutputType = {
    id: bigint
    name: string
    billingName: string | null
    taxNumber: string | null
    shippingAddress: string | null
    contactName: string | null
    email: string | null
    phone: string | null
    note: string | null
    active: boolean
    createdBy: string
    createdAt: Date
    updatedAt: Date
    version: number
    _count: PartnerCountAggregateOutputType | null
    _avg: PartnerAvgAggregateOutputType | null
    _sum: PartnerSumAggregateOutputType | null
    _min: PartnerMinAggregateOutputType | null
    _max: PartnerMaxAggregateOutputType | null
  }

  type GetPartnerGroupByPayload<T extends PartnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PartnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PartnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PartnerGroupByOutputType[P]>
            : GetScalarType<T[P], PartnerGroupByOutputType[P]>
        }
      >
    >


  export type PartnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    billingName?: boolean
    taxNumber?: boolean
    shippingAddress?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    note?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    shipments?: boolean | Partner$shipmentsArgs<ExtArgs>
    users?: boolean | Partner$usersArgs<ExtArgs>
    _count?: boolean | PartnerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partner"]>

  export type PartnerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    billingName?: boolean
    taxNumber?: boolean
    shippingAddress?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    note?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }, ExtArgs["result"]["partner"]>

  export type PartnerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    billingName?: boolean
    taxNumber?: boolean
    shippingAddress?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    note?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }, ExtArgs["result"]["partner"]>

  export type PartnerSelectScalar = {
    id?: boolean
    name?: boolean
    billingName?: boolean
    taxNumber?: boolean
    shippingAddress?: boolean
    contactName?: boolean
    email?: boolean
    phone?: boolean
    note?: boolean
    active?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }

  export type PartnerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "billingName" | "taxNumber" | "shippingAddress" | "contactName" | "email" | "phone" | "note" | "active" | "createdBy" | "createdAt" | "updatedAt" | "version", ExtArgs["result"]["partner"]>
  export type PartnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipments?: boolean | Partner$shipmentsArgs<ExtArgs>
    users?: boolean | Partner$usersArgs<ExtArgs>
    _count?: boolean | PartnerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PartnerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PartnerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PartnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Partner"
    objects: {
      shipments: Prisma.$ShipmentPayload<ExtArgs>[]
      users: Prisma.$AppUserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      name: string
      billingName: string | null
      taxNumber: string | null
      shippingAddress: string | null
      contactName: string | null
      email: string | null
      phone: string | null
      note: string | null
      active: boolean
      createdBy: string
      createdAt: Date
      updatedAt: Date
      version: number
    }, ExtArgs["result"]["partner"]>
    composites: {}
  }

  type PartnerGetPayload<S extends boolean | null | undefined | PartnerDefaultArgs> = $Result.GetResult<Prisma.$PartnerPayload, S>

  type PartnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PartnerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PartnerCountAggregateInputType | true
    }

  export interface PartnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Partner'], meta: { name: 'Partner' } }
    /**
     * Find zero or one Partner that matches the filter.
     * @param {PartnerFindUniqueArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PartnerFindUniqueArgs>(args: SelectSubset<T, PartnerFindUniqueArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Partner that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PartnerFindUniqueOrThrowArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PartnerFindUniqueOrThrowArgs>(args: SelectSubset<T, PartnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerFindFirstArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PartnerFindFirstArgs>(args?: SelectSubset<T, PartnerFindFirstArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerFindFirstOrThrowArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PartnerFindFirstOrThrowArgs>(args?: SelectSubset<T, PartnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Partners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Partners
     * const partners = await prisma.partner.findMany()
     * 
     * // Get first 10 Partners
     * const partners = await prisma.partner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const partnerWithIdOnly = await prisma.partner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PartnerFindManyArgs>(args?: SelectSubset<T, PartnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Partner.
     * @param {PartnerCreateArgs} args - Arguments to create a Partner.
     * @example
     * // Create one Partner
     * const Partner = await prisma.partner.create({
     *   data: {
     *     // ... data to create a Partner
     *   }
     * })
     * 
     */
    create<T extends PartnerCreateArgs>(args: SelectSubset<T, PartnerCreateArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Partners.
     * @param {PartnerCreateManyArgs} args - Arguments to create many Partners.
     * @example
     * // Create many Partners
     * const partner = await prisma.partner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PartnerCreateManyArgs>(args?: SelectSubset<T, PartnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Partners and returns the data saved in the database.
     * @param {PartnerCreateManyAndReturnArgs} args - Arguments to create many Partners.
     * @example
     * // Create many Partners
     * const partner = await prisma.partner.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Partners and only return the `id`
     * const partnerWithIdOnly = await prisma.partner.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PartnerCreateManyAndReturnArgs>(args?: SelectSubset<T, PartnerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Partner.
     * @param {PartnerDeleteArgs} args - Arguments to delete one Partner.
     * @example
     * // Delete one Partner
     * const Partner = await prisma.partner.delete({
     *   where: {
     *     // ... filter to delete one Partner
     *   }
     * })
     * 
     */
    delete<T extends PartnerDeleteArgs>(args: SelectSubset<T, PartnerDeleteArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Partner.
     * @param {PartnerUpdateArgs} args - Arguments to update one Partner.
     * @example
     * // Update one Partner
     * const partner = await prisma.partner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PartnerUpdateArgs>(args: SelectSubset<T, PartnerUpdateArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Partners.
     * @param {PartnerDeleteManyArgs} args - Arguments to filter Partners to delete.
     * @example
     * // Delete a few Partners
     * const { count } = await prisma.partner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PartnerDeleteManyArgs>(args?: SelectSubset<T, PartnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Partners
     * const partner = await prisma.partner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PartnerUpdateManyArgs>(args: SelectSubset<T, PartnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Partners and returns the data updated in the database.
     * @param {PartnerUpdateManyAndReturnArgs} args - Arguments to update many Partners.
     * @example
     * // Update many Partners
     * const partner = await prisma.partner.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Partners and only return the `id`
     * const partnerWithIdOnly = await prisma.partner.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PartnerUpdateManyAndReturnArgs>(args: SelectSubset<T, PartnerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Partner.
     * @param {PartnerUpsertArgs} args - Arguments to update or create a Partner.
     * @example
     * // Update or create a Partner
     * const partner = await prisma.partner.upsert({
     *   create: {
     *     // ... data to create a Partner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Partner we want to update
     *   }
     * })
     */
    upsert<T extends PartnerUpsertArgs>(args: SelectSubset<T, PartnerUpsertArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerCountArgs} args - Arguments to filter Partners to count.
     * @example
     * // Count the number of Partners
     * const count = await prisma.partner.count({
     *   where: {
     *     // ... the filter for the Partners we want to count
     *   }
     * })
    **/
    count<T extends PartnerCountArgs>(
      args?: Subset<T, PartnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PartnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Partner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PartnerAggregateArgs>(args: Subset<T, PartnerAggregateArgs>): Prisma.PrismaPromise<GetPartnerAggregateType<T>>

    /**
     * Group by Partner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PartnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PartnerGroupByArgs['orderBy'] }
        : { orderBy?: PartnerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PartnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Partner model
   */
  readonly fields: PartnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Partner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PartnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipments<T extends Partner$shipmentsArgs<ExtArgs> = {}>(args?: Subset<T, Partner$shipmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Partner$usersArgs<ExtArgs> = {}>(args?: Subset<T, Partner$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Partner model
   */
  interface PartnerFieldRefs {
    readonly id: FieldRef<"Partner", 'BigInt'>
    readonly name: FieldRef<"Partner", 'String'>
    readonly billingName: FieldRef<"Partner", 'String'>
    readonly taxNumber: FieldRef<"Partner", 'String'>
    readonly shippingAddress: FieldRef<"Partner", 'String'>
    readonly contactName: FieldRef<"Partner", 'String'>
    readonly email: FieldRef<"Partner", 'String'>
    readonly phone: FieldRef<"Partner", 'String'>
    readonly note: FieldRef<"Partner", 'String'>
    readonly active: FieldRef<"Partner", 'Boolean'>
    readonly createdBy: FieldRef<"Partner", 'String'>
    readonly createdAt: FieldRef<"Partner", 'DateTime'>
    readonly updatedAt: FieldRef<"Partner", 'DateTime'>
    readonly version: FieldRef<"Partner", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Partner findUnique
   */
  export type PartnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner findUniqueOrThrow
   */
  export type PartnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner findFirst
   */
  export type PartnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Partners.
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Partners.
     */
    distinct?: PartnerScalarFieldEnum | PartnerScalarFieldEnum[]
  }

  /**
   * Partner findFirstOrThrow
   */
  export type PartnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Partners.
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Partners.
     */
    distinct?: PartnerScalarFieldEnum | PartnerScalarFieldEnum[]
  }

  /**
   * Partner findMany
   */
  export type PartnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partners to fetch.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Partners.
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Partners.
     */
    distinct?: PartnerScalarFieldEnum | PartnerScalarFieldEnum[]
  }

  /**
   * Partner create
   */
  export type PartnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * The data needed to create a Partner.
     */
    data: XOR<PartnerCreateInput, PartnerUncheckedCreateInput>
  }

  /**
   * Partner createMany
   */
  export type PartnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Partners.
     */
    data: PartnerCreateManyInput | PartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Partner createManyAndReturn
   */
  export type PartnerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * The data used to create many Partners.
     */
    data: PartnerCreateManyInput | PartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Partner update
   */
  export type PartnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * The data needed to update a Partner.
     */
    data: XOR<PartnerUpdateInput, PartnerUncheckedUpdateInput>
    /**
     * Choose, which Partner to update.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner updateMany
   */
  export type PartnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Partners.
     */
    data: XOR<PartnerUpdateManyMutationInput, PartnerUncheckedUpdateManyInput>
    /**
     * Filter which Partners to update
     */
    where?: PartnerWhereInput
    /**
     * Limit how many Partners to update.
     */
    limit?: number
  }

  /**
   * Partner updateManyAndReturn
   */
  export type PartnerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * The data used to update Partners.
     */
    data: XOR<PartnerUpdateManyMutationInput, PartnerUncheckedUpdateManyInput>
    /**
     * Filter which Partners to update
     */
    where?: PartnerWhereInput
    /**
     * Limit how many Partners to update.
     */
    limit?: number
  }

  /**
   * Partner upsert
   */
  export type PartnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * The filter to search for the Partner to update in case it exists.
     */
    where: PartnerWhereUniqueInput
    /**
     * In case the Partner found by the `where` argument doesn't exist, create a new Partner with this data.
     */
    create: XOR<PartnerCreateInput, PartnerUncheckedCreateInput>
    /**
     * In case the Partner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PartnerUpdateInput, PartnerUncheckedUpdateInput>
  }

  /**
   * Partner delete
   */
  export type PartnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter which Partner to delete.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner deleteMany
   */
  export type PartnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Partners to delete
     */
    where?: PartnerWhereInput
    /**
     * Limit how many Partners to delete.
     */
    limit?: number
  }

  /**
   * Partner.shipments
   */
  export type Partner$shipmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    where?: ShipmentWhereInput
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    cursor?: ShipmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Partner.users
   */
  export type Partner$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    where?: AppUserWhereInput
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    cursor?: AppUserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * Partner without action
   */
  export type PartnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
  }


  /**
   * Model Shipment
   */

  export type AggregateShipment = {
    _count: ShipmentCountAggregateOutputType | null
    _avg: ShipmentAvgAggregateOutputType | null
    _sum: ShipmentSumAggregateOutputType | null
    _min: ShipmentMinAggregateOutputType | null
    _max: ShipmentMaxAggregateOutputType | null
  }

  export type ShipmentAvgAggregateOutputType = {
    id: number | null
    shipmentYear: number | null
    shipmentSequence: number | null
    partnerId: number | null
    version: number | null
  }

  export type ShipmentSumAggregateOutputType = {
    id: bigint | null
    shipmentYear: number | null
    shipmentSequence: number | null
    partnerId: bigint | null
    version: number | null
  }

  export type ShipmentMinAggregateOutputType = {
    id: bigint | null
    shipmentNumber: string | null
    shipmentYear: number | null
    shipmentSequence: number | null
    partnerId: bigint | null
    shipmentDate: Date | null
    shippingAddress: string | null
    customerOrderNumber: string | null
    deliveryNoteNumber: string | null
    note: string | null
    status: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    closedBy: string | null
    closedAt: Date | null
    shippedBy: string | null
    shippedAt: Date | null
    voidedBy: string | null
    voidedAt: Date | null
    voidReason: string | null
    version: number | null
  }

  export type ShipmentMaxAggregateOutputType = {
    id: bigint | null
    shipmentNumber: string | null
    shipmentYear: number | null
    shipmentSequence: number | null
    partnerId: bigint | null
    shipmentDate: Date | null
    shippingAddress: string | null
    customerOrderNumber: string | null
    deliveryNoteNumber: string | null
    note: string | null
    status: string | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    closedBy: string | null
    closedAt: Date | null
    shippedBy: string | null
    shippedAt: Date | null
    voidedBy: string | null
    voidedAt: Date | null
    voidReason: string | null
    version: number | null
  }

  export type ShipmentCountAggregateOutputType = {
    id: number
    shipmentNumber: number
    shipmentYear: number
    shipmentSequence: number
    partnerId: number
    shipmentDate: number
    shippingAddress: number
    customerOrderNumber: number
    deliveryNoteNumber: number
    note: number
    status: number
    createdBy: number
    createdAt: number
    updatedAt: number
    closedBy: number
    closedAt: number
    shippedBy: number
    shippedAt: number
    voidedBy: number
    voidedAt: number
    voidReason: number
    version: number
    _all: number
  }


  export type ShipmentAvgAggregateInputType = {
    id?: true
    shipmentYear?: true
    shipmentSequence?: true
    partnerId?: true
    version?: true
  }

  export type ShipmentSumAggregateInputType = {
    id?: true
    shipmentYear?: true
    shipmentSequence?: true
    partnerId?: true
    version?: true
  }

  export type ShipmentMinAggregateInputType = {
    id?: true
    shipmentNumber?: true
    shipmentYear?: true
    shipmentSequence?: true
    partnerId?: true
    shipmentDate?: true
    shippingAddress?: true
    customerOrderNumber?: true
    deliveryNoteNumber?: true
    note?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    closedBy?: true
    closedAt?: true
    shippedBy?: true
    shippedAt?: true
    voidedBy?: true
    voidedAt?: true
    voidReason?: true
    version?: true
  }

  export type ShipmentMaxAggregateInputType = {
    id?: true
    shipmentNumber?: true
    shipmentYear?: true
    shipmentSequence?: true
    partnerId?: true
    shipmentDate?: true
    shippingAddress?: true
    customerOrderNumber?: true
    deliveryNoteNumber?: true
    note?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    closedBy?: true
    closedAt?: true
    shippedBy?: true
    shippedAt?: true
    voidedBy?: true
    voidedAt?: true
    voidReason?: true
    version?: true
  }

  export type ShipmentCountAggregateInputType = {
    id?: true
    shipmentNumber?: true
    shipmentYear?: true
    shipmentSequence?: true
    partnerId?: true
    shipmentDate?: true
    shippingAddress?: true
    customerOrderNumber?: true
    deliveryNoteNumber?: true
    note?: true
    status?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    closedBy?: true
    closedAt?: true
    shippedBy?: true
    shippedAt?: true
    voidedBy?: true
    voidedAt?: true
    voidReason?: true
    version?: true
    _all?: true
  }

  export type ShipmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipment to aggregate.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shipments
    **/
    _count?: true | ShipmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShipmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShipmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentMaxAggregateInputType
  }

  export type GetShipmentAggregateType<T extends ShipmentAggregateArgs> = {
        [P in keyof T & keyof AggregateShipment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipment[P]>
      : GetScalarType<T[P], AggregateShipment[P]>
  }




  export type ShipmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentWhereInput
    orderBy?: ShipmentOrderByWithAggregationInput | ShipmentOrderByWithAggregationInput[]
    by: ShipmentScalarFieldEnum[] | ShipmentScalarFieldEnum
    having?: ShipmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentCountAggregateInputType | true
    _avg?: ShipmentAvgAggregateInputType
    _sum?: ShipmentSumAggregateInputType
    _min?: ShipmentMinAggregateInputType
    _max?: ShipmentMaxAggregateInputType
  }

  export type ShipmentGroupByOutputType = {
    id: bigint
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    partnerId: bigint
    shipmentDate: Date
    shippingAddress: string | null
    customerOrderNumber: string | null
    deliveryNoteNumber: string | null
    note: string | null
    status: string
    createdBy: string
    createdAt: Date
    updatedAt: Date
    closedBy: string | null
    closedAt: Date | null
    shippedBy: string | null
    shippedAt: Date | null
    voidedBy: string | null
    voidedAt: Date | null
    voidReason: string | null
    version: number
    _count: ShipmentCountAggregateOutputType | null
    _avg: ShipmentAvgAggregateOutputType | null
    _sum: ShipmentSumAggregateOutputType | null
    _min: ShipmentMinAggregateOutputType | null
    _max: ShipmentMaxAggregateOutputType | null
  }

  type GetShipmentGroupByPayload<T extends ShipmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentNumber?: boolean
    shipmentYear?: boolean
    shipmentSequence?: boolean
    partnerId?: boolean
    shipmentDate?: boolean
    shippingAddress?: boolean
    customerOrderNumber?: boolean
    deliveryNoteNumber?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedBy?: boolean
    closedAt?: boolean
    shippedBy?: boolean
    shippedAt?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    voidReason?: boolean
    version?: boolean
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
    items?: boolean | Shipment$itemsArgs<ExtArgs>
    events?: boolean | Shipment$eventsArgs<ExtArgs>
    _count?: boolean | ShipmentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentNumber?: boolean
    shipmentYear?: boolean
    shipmentSequence?: boolean
    partnerId?: boolean
    shipmentDate?: boolean
    shippingAddress?: boolean
    customerOrderNumber?: boolean
    deliveryNoteNumber?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedBy?: boolean
    closedAt?: boolean
    shippedBy?: boolean
    shippedAt?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    voidReason?: boolean
    version?: boolean
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentNumber?: boolean
    shipmentYear?: boolean
    shipmentSequence?: boolean
    partnerId?: boolean
    shipmentDate?: boolean
    shippingAddress?: boolean
    customerOrderNumber?: boolean
    deliveryNoteNumber?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedBy?: boolean
    closedAt?: boolean
    shippedBy?: boolean
    shippedAt?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    voidReason?: boolean
    version?: boolean
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipment"]>

  export type ShipmentSelectScalar = {
    id?: boolean
    shipmentNumber?: boolean
    shipmentYear?: boolean
    shipmentSequence?: boolean
    partnerId?: boolean
    shipmentDate?: boolean
    shippingAddress?: boolean
    customerOrderNumber?: boolean
    deliveryNoteNumber?: boolean
    note?: boolean
    status?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    closedBy?: boolean
    closedAt?: boolean
    shippedBy?: boolean
    shippedAt?: boolean
    voidedBy?: boolean
    voidedAt?: boolean
    voidReason?: boolean
    version?: boolean
  }

  export type ShipmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shipmentNumber" | "shipmentYear" | "shipmentSequence" | "partnerId" | "shipmentDate" | "shippingAddress" | "customerOrderNumber" | "deliveryNoteNumber" | "note" | "status" | "createdBy" | "createdAt" | "updatedAt" | "closedBy" | "closedAt" | "shippedBy" | "shippedAt" | "voidedBy" | "voidedAt" | "voidReason" | "version", ExtArgs["result"]["shipment"]>
  export type ShipmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
    items?: boolean | Shipment$itemsArgs<ExtArgs>
    events?: boolean | Shipment$eventsArgs<ExtArgs>
    _count?: boolean | ShipmentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShipmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }
  export type ShipmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }

  export type $ShipmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shipment"
    objects: {
      partner: Prisma.$PartnerPayload<ExtArgs>
      items: Prisma.$ShipmentItemPayload<ExtArgs>[]
      events: Prisma.$ShipmentEventPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      shipmentNumber: string
      shipmentYear: number
      shipmentSequence: number
      partnerId: bigint
      shipmentDate: Date
      shippingAddress: string | null
      customerOrderNumber: string | null
      deliveryNoteNumber: string | null
      note: string | null
      status: string
      createdBy: string
      createdAt: Date
      updatedAt: Date
      closedBy: string | null
      closedAt: Date | null
      shippedBy: string | null
      shippedAt: Date | null
      voidedBy: string | null
      voidedAt: Date | null
      voidReason: string | null
      version: number
    }, ExtArgs["result"]["shipment"]>
    composites: {}
  }

  type ShipmentGetPayload<S extends boolean | null | undefined | ShipmentDefaultArgs> = $Result.GetResult<Prisma.$ShipmentPayload, S>

  type ShipmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentCountAggregateInputType | true
    }

  export interface ShipmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shipment'], meta: { name: 'Shipment' } }
    /**
     * Find zero or one Shipment that matches the filter.
     * @param {ShipmentFindUniqueArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentFindUniqueArgs>(args: SelectSubset<T, ShipmentFindUniqueArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Shipment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentFindUniqueOrThrowArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shipment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindFirstArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentFindFirstArgs>(args?: SelectSubset<T, ShipmentFindFirstArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Shipment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindFirstOrThrowArgs} args - Arguments to find a Shipment
     * @example
     * // Get one Shipment
     * const shipment = await prisma.shipment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Shipments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shipments
     * const shipments = await prisma.shipment.findMany()
     * 
     * // Get first 10 Shipments
     * const shipments = await prisma.shipment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentWithIdOnly = await prisma.shipment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentFindManyArgs>(args?: SelectSubset<T, ShipmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Shipment.
     * @param {ShipmentCreateArgs} args - Arguments to create a Shipment.
     * @example
     * // Create one Shipment
     * const Shipment = await prisma.shipment.create({
     *   data: {
     *     // ... data to create a Shipment
     *   }
     * })
     * 
     */
    create<T extends ShipmentCreateArgs>(args: SelectSubset<T, ShipmentCreateArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Shipments.
     * @param {ShipmentCreateManyArgs} args - Arguments to create many Shipments.
     * @example
     * // Create many Shipments
     * const shipment = await prisma.shipment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentCreateManyArgs>(args?: SelectSubset<T, ShipmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shipments and returns the data saved in the database.
     * @param {ShipmentCreateManyAndReturnArgs} args - Arguments to create many Shipments.
     * @example
     * // Create many Shipments
     * const shipment = await prisma.shipment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shipments and only return the `id`
     * const shipmentWithIdOnly = await prisma.shipment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Shipment.
     * @param {ShipmentDeleteArgs} args - Arguments to delete one Shipment.
     * @example
     * // Delete one Shipment
     * const Shipment = await prisma.shipment.delete({
     *   where: {
     *     // ... filter to delete one Shipment
     *   }
     * })
     * 
     */
    delete<T extends ShipmentDeleteArgs>(args: SelectSubset<T, ShipmentDeleteArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Shipment.
     * @param {ShipmentUpdateArgs} args - Arguments to update one Shipment.
     * @example
     * // Update one Shipment
     * const shipment = await prisma.shipment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentUpdateArgs>(args: SelectSubset<T, ShipmentUpdateArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Shipments.
     * @param {ShipmentDeleteManyArgs} args - Arguments to filter Shipments to delete.
     * @example
     * // Delete a few Shipments
     * const { count } = await prisma.shipment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentDeleteManyArgs>(args?: SelectSubset<T, ShipmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shipments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shipments
     * const shipment = await prisma.shipment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentUpdateManyArgs>(args: SelectSubset<T, ShipmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shipments and returns the data updated in the database.
     * @param {ShipmentUpdateManyAndReturnArgs} args - Arguments to update many Shipments.
     * @example
     * // Update many Shipments
     * const shipment = await prisma.shipment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Shipments and only return the `id`
     * const shipmentWithIdOnly = await prisma.shipment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Shipment.
     * @param {ShipmentUpsertArgs} args - Arguments to update or create a Shipment.
     * @example
     * // Update or create a Shipment
     * const shipment = await prisma.shipment.upsert({
     *   create: {
     *     // ... data to create a Shipment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shipment we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentUpsertArgs>(args: SelectSubset<T, ShipmentUpsertArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Shipments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentCountArgs} args - Arguments to filter Shipments to count.
     * @example
     * // Count the number of Shipments
     * const count = await prisma.shipment.count({
     *   where: {
     *     // ... the filter for the Shipments we want to count
     *   }
     * })
    **/
    count<T extends ShipmentCountArgs>(
      args?: Subset<T, ShipmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shipment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentAggregateArgs>(args: Subset<T, ShipmentAggregateArgs>): Prisma.PrismaPromise<GetShipmentAggregateType<T>>

    /**
     * Group by Shipment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shipment model
   */
  readonly fields: ShipmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shipment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    partner<T extends PartnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PartnerDefaultArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends Shipment$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Shipment$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    events<T extends Shipment$eventsArgs<ExtArgs> = {}>(args?: Subset<T, Shipment$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shipment model
   */
  interface ShipmentFieldRefs {
    readonly id: FieldRef<"Shipment", 'BigInt'>
    readonly shipmentNumber: FieldRef<"Shipment", 'String'>
    readonly shipmentYear: FieldRef<"Shipment", 'Int'>
    readonly shipmentSequence: FieldRef<"Shipment", 'Int'>
    readonly partnerId: FieldRef<"Shipment", 'BigInt'>
    readonly shipmentDate: FieldRef<"Shipment", 'DateTime'>
    readonly shippingAddress: FieldRef<"Shipment", 'String'>
    readonly customerOrderNumber: FieldRef<"Shipment", 'String'>
    readonly deliveryNoteNumber: FieldRef<"Shipment", 'String'>
    readonly note: FieldRef<"Shipment", 'String'>
    readonly status: FieldRef<"Shipment", 'String'>
    readonly createdBy: FieldRef<"Shipment", 'String'>
    readonly createdAt: FieldRef<"Shipment", 'DateTime'>
    readonly updatedAt: FieldRef<"Shipment", 'DateTime'>
    readonly closedBy: FieldRef<"Shipment", 'String'>
    readonly closedAt: FieldRef<"Shipment", 'DateTime'>
    readonly shippedBy: FieldRef<"Shipment", 'String'>
    readonly shippedAt: FieldRef<"Shipment", 'DateTime'>
    readonly voidedBy: FieldRef<"Shipment", 'String'>
    readonly voidedAt: FieldRef<"Shipment", 'DateTime'>
    readonly voidReason: FieldRef<"Shipment", 'String'>
    readonly version: FieldRef<"Shipment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Shipment findUnique
   */
  export type ShipmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment findUniqueOrThrow
   */
  export type ShipmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment findFirst
   */
  export type ShipmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment findFirstOrThrow
   */
  export type ShipmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipment to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment findMany
   */
  export type ShipmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter, which Shipments to fetch.
     */
    where?: ShipmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shipments to fetch.
     */
    orderBy?: ShipmentOrderByWithRelationInput | ShipmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shipments.
     */
    cursor?: ShipmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shipments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shipments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shipments.
     */
    distinct?: ShipmentScalarFieldEnum | ShipmentScalarFieldEnum[]
  }

  /**
   * Shipment create
   */
  export type ShipmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The data needed to create a Shipment.
     */
    data: XOR<ShipmentCreateInput, ShipmentUncheckedCreateInput>
  }

  /**
   * Shipment createMany
   */
  export type ShipmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shipments.
     */
    data: ShipmentCreateManyInput | ShipmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shipment createManyAndReturn
   */
  export type ShipmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * The data used to create many Shipments.
     */
    data: ShipmentCreateManyInput | ShipmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shipment update
   */
  export type ShipmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The data needed to update a Shipment.
     */
    data: XOR<ShipmentUpdateInput, ShipmentUncheckedUpdateInput>
    /**
     * Choose, which Shipment to update.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment updateMany
   */
  export type ShipmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shipments.
     */
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyInput>
    /**
     * Filter which Shipments to update
     */
    where?: ShipmentWhereInput
    /**
     * Limit how many Shipments to update.
     */
    limit?: number
  }

  /**
   * Shipment updateManyAndReturn
   */
  export type ShipmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * The data used to update Shipments.
     */
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyInput>
    /**
     * Filter which Shipments to update
     */
    where?: ShipmentWhereInput
    /**
     * Limit how many Shipments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shipment upsert
   */
  export type ShipmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * The filter to search for the Shipment to update in case it exists.
     */
    where: ShipmentWhereUniqueInput
    /**
     * In case the Shipment found by the `where` argument doesn't exist, create a new Shipment with this data.
     */
    create: XOR<ShipmentCreateInput, ShipmentUncheckedCreateInput>
    /**
     * In case the Shipment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentUpdateInput, ShipmentUncheckedUpdateInput>
  }

  /**
   * Shipment delete
   */
  export type ShipmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
    /**
     * Filter which Shipment to delete.
     */
    where: ShipmentWhereUniqueInput
  }

  /**
   * Shipment deleteMany
   */
  export type ShipmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shipments to delete
     */
    where?: ShipmentWhereInput
    /**
     * Limit how many Shipments to delete.
     */
    limit?: number
  }

  /**
   * Shipment.items
   */
  export type Shipment$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    cursor?: ShipmentItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * Shipment.events
   */
  export type Shipment$eventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    where?: ShipmentEventWhereInput
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    cursor?: ShipmentEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * Shipment without action
   */
  export type ShipmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shipment
     */
    select?: ShipmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Shipment
     */
    omit?: ShipmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentInclude<ExtArgs> | null
  }


  /**
   * Model ShipmentItem
   */

  export type AggregateShipmentItem = {
    _count: ShipmentItemCountAggregateOutputType | null
    _avg: ShipmentItemAvgAggregateOutputType | null
    _sum: ShipmentItemSumAggregateOutputType | null
    _min: ShipmentItemMinAggregateOutputType | null
    _max: ShipmentItemMaxAggregateOutputType | null
  }

  export type ShipmentItemAvgAggregateOutputType = {
    id: number | null
    shipmentId: number | null
    lotId: number | null
    quantity: number | null
    version: number | null
  }

  export type ShipmentItemSumAggregateOutputType = {
    id: bigint | null
    shipmentId: bigint | null
    lotId: bigint | null
    quantity: number | null
    version: number | null
  }

  export type ShipmentItemMinAggregateOutputType = {
    id: bigint | null
    shipmentId: bigint | null
    lotId: bigint | null
    quantity: number | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type ShipmentItemMaxAggregateOutputType = {
    id: bigint | null
    shipmentId: bigint | null
    lotId: bigint | null
    quantity: number | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
    version: number | null
  }

  export type ShipmentItemCountAggregateOutputType = {
    id: number
    shipmentId: number
    lotId: number
    quantity: number
    createdBy: number
    createdAt: number
    updatedAt: number
    version: number
    _all: number
  }


  export type ShipmentItemAvgAggregateInputType = {
    id?: true
    shipmentId?: true
    lotId?: true
    quantity?: true
    version?: true
  }

  export type ShipmentItemSumAggregateInputType = {
    id?: true
    shipmentId?: true
    lotId?: true
    quantity?: true
    version?: true
  }

  export type ShipmentItemMinAggregateInputType = {
    id?: true
    shipmentId?: true
    lotId?: true
    quantity?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type ShipmentItemMaxAggregateInputType = {
    id?: true
    shipmentId?: true
    lotId?: true
    quantity?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
  }

  export type ShipmentItemCountAggregateInputType = {
    id?: true
    shipmentId?: true
    lotId?: true
    quantity?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    version?: true
    _all?: true
  }

  export type ShipmentItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentItem to aggregate.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShipmentItems
    **/
    _count?: true | ShipmentItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShipmentItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShipmentItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentItemMaxAggregateInputType
  }

  export type GetShipmentItemAggregateType<T extends ShipmentItemAggregateArgs> = {
        [P in keyof T & keyof AggregateShipmentItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipmentItem[P]>
      : GetScalarType<T[P], AggregateShipmentItem[P]>
  }




  export type ShipmentItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentItemWhereInput
    orderBy?: ShipmentItemOrderByWithAggregationInput | ShipmentItemOrderByWithAggregationInput[]
    by: ShipmentItemScalarFieldEnum[] | ShipmentItemScalarFieldEnum
    having?: ShipmentItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentItemCountAggregateInputType | true
    _avg?: ShipmentItemAvgAggregateInputType
    _sum?: ShipmentItemSumAggregateInputType
    _min?: ShipmentItemMinAggregateInputType
    _max?: ShipmentItemMaxAggregateInputType
  }

  export type ShipmentItemGroupByOutputType = {
    id: bigint
    shipmentId: bigint
    lotId: bigint
    quantity: number
    createdBy: string
    createdAt: Date
    updatedAt: Date
    version: number
    _count: ShipmentItemCountAggregateOutputType | null
    _avg: ShipmentItemAvgAggregateOutputType | null
    _sum: ShipmentItemSumAggregateOutputType | null
    _min: ShipmentItemMinAggregateOutputType | null
    _max: ShipmentItemMaxAggregateOutputType | null
  }

  type GetShipmentItemGroupByPayload<T extends ShipmentItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentItemGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentItemGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    lotId?: boolean
    quantity?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    lotId?: boolean
    quantity?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    lotId?: boolean
    quantity?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentItem"]>

  export type ShipmentItemSelectScalar = {
    id?: boolean
    shipmentId?: boolean
    lotId?: boolean
    quantity?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    version?: boolean
  }

  export type ShipmentItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shipmentId" | "lotId" | "quantity" | "createdBy" | "createdAt" | "updatedAt" | "version", ExtArgs["result"]["shipmentItem"]>
  export type ShipmentItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type ShipmentItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }
  export type ShipmentItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
    lot?: boolean | LotDefaultArgs<ExtArgs>
  }

  export type $ShipmentItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShipmentItem"
    objects: {
      shipment: Prisma.$ShipmentPayload<ExtArgs>
      lot: Prisma.$LotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      shipmentId: bigint
      lotId: bigint
      quantity: number
      createdBy: string
      createdAt: Date
      updatedAt: Date
      version: number
    }, ExtArgs["result"]["shipmentItem"]>
    composites: {}
  }

  type ShipmentItemGetPayload<S extends boolean | null | undefined | ShipmentItemDefaultArgs> = $Result.GetResult<Prisma.$ShipmentItemPayload, S>

  type ShipmentItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentItemCountAggregateInputType | true
    }

  export interface ShipmentItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShipmentItem'], meta: { name: 'ShipmentItem' } }
    /**
     * Find zero or one ShipmentItem that matches the filter.
     * @param {ShipmentItemFindUniqueArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentItemFindUniqueArgs>(args: SelectSubset<T, ShipmentItemFindUniqueArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShipmentItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentItemFindUniqueOrThrowArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindFirstArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentItemFindFirstArgs>(args?: SelectSubset<T, ShipmentItemFindFirstArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindFirstOrThrowArgs} args - Arguments to find a ShipmentItem
     * @example
     * // Get one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShipmentItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShipmentItems
     * const shipmentItems = await prisma.shipmentItem.findMany()
     * 
     * // Get first 10 ShipmentItems
     * const shipmentItems = await prisma.shipmentItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentItemFindManyArgs>(args?: SelectSubset<T, ShipmentItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShipmentItem.
     * @param {ShipmentItemCreateArgs} args - Arguments to create a ShipmentItem.
     * @example
     * // Create one ShipmentItem
     * const ShipmentItem = await prisma.shipmentItem.create({
     *   data: {
     *     // ... data to create a ShipmentItem
     *   }
     * })
     * 
     */
    create<T extends ShipmentItemCreateArgs>(args: SelectSubset<T, ShipmentItemCreateArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShipmentItems.
     * @param {ShipmentItemCreateManyArgs} args - Arguments to create many ShipmentItems.
     * @example
     * // Create many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentItemCreateManyArgs>(args?: SelectSubset<T, ShipmentItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShipmentItems and returns the data saved in the database.
     * @param {ShipmentItemCreateManyAndReturnArgs} args - Arguments to create many ShipmentItems.
     * @example
     * // Create many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShipmentItems and only return the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShipmentItem.
     * @param {ShipmentItemDeleteArgs} args - Arguments to delete one ShipmentItem.
     * @example
     * // Delete one ShipmentItem
     * const ShipmentItem = await prisma.shipmentItem.delete({
     *   where: {
     *     // ... filter to delete one ShipmentItem
     *   }
     * })
     * 
     */
    delete<T extends ShipmentItemDeleteArgs>(args: SelectSubset<T, ShipmentItemDeleteArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShipmentItem.
     * @param {ShipmentItemUpdateArgs} args - Arguments to update one ShipmentItem.
     * @example
     * // Update one ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentItemUpdateArgs>(args: SelectSubset<T, ShipmentItemUpdateArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShipmentItems.
     * @param {ShipmentItemDeleteManyArgs} args - Arguments to filter ShipmentItems to delete.
     * @example
     * // Delete a few ShipmentItems
     * const { count } = await prisma.shipmentItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentItemDeleteManyArgs>(args?: SelectSubset<T, ShipmentItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentItemUpdateManyArgs>(args: SelectSubset<T, ShipmentItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentItems and returns the data updated in the database.
     * @param {ShipmentItemUpdateManyAndReturnArgs} args - Arguments to update many ShipmentItems.
     * @example
     * // Update many ShipmentItems
     * const shipmentItem = await prisma.shipmentItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShipmentItems and only return the `id`
     * const shipmentItemWithIdOnly = await prisma.shipmentItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentItemUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShipmentItem.
     * @param {ShipmentItemUpsertArgs} args - Arguments to update or create a ShipmentItem.
     * @example
     * // Update or create a ShipmentItem
     * const shipmentItem = await prisma.shipmentItem.upsert({
     *   create: {
     *     // ... data to create a ShipmentItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShipmentItem we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentItemUpsertArgs>(args: SelectSubset<T, ShipmentItemUpsertArgs<ExtArgs>>): Prisma__ShipmentItemClient<$Result.GetResult<Prisma.$ShipmentItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShipmentItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemCountArgs} args - Arguments to filter ShipmentItems to count.
     * @example
     * // Count the number of ShipmentItems
     * const count = await prisma.shipmentItem.count({
     *   where: {
     *     // ... the filter for the ShipmentItems we want to count
     *   }
     * })
    **/
    count<T extends ShipmentItemCountArgs>(
      args?: Subset<T, ShipmentItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShipmentItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentItemAggregateArgs>(args: Subset<T, ShipmentItemAggregateArgs>): Prisma.PrismaPromise<GetShipmentItemAggregateType<T>>

    /**
     * Group by ShipmentItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentItemGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShipmentItem model
   */
  readonly fields: ShipmentItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShipmentItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipment<T extends ShipmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShipmentDefaultArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    lot<T extends LotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LotDefaultArgs<ExtArgs>>): Prisma__LotClient<$Result.GetResult<Prisma.$LotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShipmentItem model
   */
  interface ShipmentItemFieldRefs {
    readonly id: FieldRef<"ShipmentItem", 'BigInt'>
    readonly shipmentId: FieldRef<"ShipmentItem", 'BigInt'>
    readonly lotId: FieldRef<"ShipmentItem", 'BigInt'>
    readonly quantity: FieldRef<"ShipmentItem", 'Int'>
    readonly createdBy: FieldRef<"ShipmentItem", 'String'>
    readonly createdAt: FieldRef<"ShipmentItem", 'DateTime'>
    readonly updatedAt: FieldRef<"ShipmentItem", 'DateTime'>
    readonly version: FieldRef<"ShipmentItem", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ShipmentItem findUnique
   */
  export type ShipmentItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem findUniqueOrThrow
   */
  export type ShipmentItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem findFirst
   */
  export type ShipmentItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem findFirstOrThrow
   */
  export type ShipmentItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItem to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem findMany
   */
  export type ShipmentItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentItems to fetch.
     */
    where?: ShipmentItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentItems to fetch.
     */
    orderBy?: ShipmentItemOrderByWithRelationInput | ShipmentItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShipmentItems.
     */
    cursor?: ShipmentItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentItems.
     */
    distinct?: ShipmentItemScalarFieldEnum | ShipmentItemScalarFieldEnum[]
  }

  /**
   * ShipmentItem create
   */
  export type ShipmentItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ShipmentItem.
     */
    data: XOR<ShipmentItemCreateInput, ShipmentItemUncheckedCreateInput>
  }

  /**
   * ShipmentItem createMany
   */
  export type ShipmentItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShipmentItems.
     */
    data: ShipmentItemCreateManyInput | ShipmentItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShipmentItem createManyAndReturn
   */
  export type ShipmentItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * The data used to create many ShipmentItems.
     */
    data: ShipmentItemCreateManyInput | ShipmentItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentItem update
   */
  export type ShipmentItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ShipmentItem.
     */
    data: XOR<ShipmentItemUpdateInput, ShipmentItemUncheckedUpdateInput>
    /**
     * Choose, which ShipmentItem to update.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem updateMany
   */
  export type ShipmentItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShipmentItems.
     */
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentItems to update
     */
    where?: ShipmentItemWhereInput
    /**
     * Limit how many ShipmentItems to update.
     */
    limit?: number
  }

  /**
   * ShipmentItem updateManyAndReturn
   */
  export type ShipmentItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * The data used to update ShipmentItems.
     */
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentItems to update
     */
    where?: ShipmentItemWhereInput
    /**
     * Limit how many ShipmentItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentItem upsert
   */
  export type ShipmentItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ShipmentItem to update in case it exists.
     */
    where: ShipmentItemWhereUniqueInput
    /**
     * In case the ShipmentItem found by the `where` argument doesn't exist, create a new ShipmentItem with this data.
     */
    create: XOR<ShipmentItemCreateInput, ShipmentItemUncheckedCreateInput>
    /**
     * In case the ShipmentItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentItemUpdateInput, ShipmentItemUncheckedUpdateInput>
  }

  /**
   * ShipmentItem delete
   */
  export type ShipmentItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
    /**
     * Filter which ShipmentItem to delete.
     */
    where: ShipmentItemWhereUniqueInput
  }

  /**
   * ShipmentItem deleteMany
   */
  export type ShipmentItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentItems to delete
     */
    where?: ShipmentItemWhereInput
    /**
     * Limit how many ShipmentItems to delete.
     */
    limit?: number
  }

  /**
   * ShipmentItem without action
   */
  export type ShipmentItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentItem
     */
    select?: ShipmentItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentItem
     */
    omit?: ShipmentItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentItemInclude<ExtArgs> | null
  }


  /**
   * Model ShipmentEvent
   */

  export type AggregateShipmentEvent = {
    _count: ShipmentEventCountAggregateOutputType | null
    _avg: ShipmentEventAvgAggregateOutputType | null
    _sum: ShipmentEventSumAggregateOutputType | null
    _min: ShipmentEventMinAggregateOutputType | null
    _max: ShipmentEventMaxAggregateOutputType | null
  }

  export type ShipmentEventAvgAggregateOutputType = {
    id: number | null
    shipmentId: number | null
  }

  export type ShipmentEventSumAggregateOutputType = {
    id: bigint | null
    shipmentId: bigint | null
  }

  export type ShipmentEventMinAggregateOutputType = {
    id: bigint | null
    shipmentId: bigint | null
    eventType: string | null
    reason: string | null
    actorUserId: string | null
    createdAt: Date | null
  }

  export type ShipmentEventMaxAggregateOutputType = {
    id: bigint | null
    shipmentId: bigint | null
    eventType: string | null
    reason: string | null
    actorUserId: string | null
    createdAt: Date | null
  }

  export type ShipmentEventCountAggregateOutputType = {
    id: number
    shipmentId: number
    eventType: number
    reason: number
    actorUserId: number
    snapshot: number
    createdAt: number
    _all: number
  }


  export type ShipmentEventAvgAggregateInputType = {
    id?: true
    shipmentId?: true
  }

  export type ShipmentEventSumAggregateInputType = {
    id?: true
    shipmentId?: true
  }

  export type ShipmentEventMinAggregateInputType = {
    id?: true
    shipmentId?: true
    eventType?: true
    reason?: true
    actorUserId?: true
    createdAt?: true
  }

  export type ShipmentEventMaxAggregateInputType = {
    id?: true
    shipmentId?: true
    eventType?: true
    reason?: true
    actorUserId?: true
    createdAt?: true
  }

  export type ShipmentEventCountAggregateInputType = {
    id?: true
    shipmentId?: true
    eventType?: true
    reason?: true
    actorUserId?: true
    snapshot?: true
    createdAt?: true
    _all?: true
  }

  export type ShipmentEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentEvent to aggregate.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ShipmentEvents
    **/
    _count?: true | ShipmentEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShipmentEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShipmentEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShipmentEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShipmentEventMaxAggregateInputType
  }

  export type GetShipmentEventAggregateType<T extends ShipmentEventAggregateArgs> = {
        [P in keyof T & keyof AggregateShipmentEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShipmentEvent[P]>
      : GetScalarType<T[P], AggregateShipmentEvent[P]>
  }




  export type ShipmentEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShipmentEventWhereInput
    orderBy?: ShipmentEventOrderByWithAggregationInput | ShipmentEventOrderByWithAggregationInput[]
    by: ShipmentEventScalarFieldEnum[] | ShipmentEventScalarFieldEnum
    having?: ShipmentEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShipmentEventCountAggregateInputType | true
    _avg?: ShipmentEventAvgAggregateInputType
    _sum?: ShipmentEventSumAggregateInputType
    _min?: ShipmentEventMinAggregateInputType
    _max?: ShipmentEventMaxAggregateInputType
  }

  export type ShipmentEventGroupByOutputType = {
    id: bigint
    shipmentId: bigint
    eventType: string
    reason: string | null
    actorUserId: string | null
    snapshot: JsonValue
    createdAt: Date
    _count: ShipmentEventCountAggregateOutputType | null
    _avg: ShipmentEventAvgAggregateOutputType | null
    _sum: ShipmentEventSumAggregateOutputType | null
    _min: ShipmentEventMinAggregateOutputType | null
    _max: ShipmentEventMaxAggregateOutputType | null
  }

  type GetShipmentEventGroupByPayload<T extends ShipmentEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShipmentEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShipmentEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShipmentEventGroupByOutputType[P]>
            : GetScalarType<T[P], ShipmentEventGroupByOutputType[P]>
        }
      >
    >


  export type ShipmentEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentEvent"]>

  export type ShipmentEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentEvent"]>

  export type ShipmentEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    shipmentId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shipmentEvent"]>

  export type ShipmentEventSelectScalar = {
    id?: boolean
    shipmentId?: boolean
    eventType?: boolean
    reason?: boolean
    actorUserId?: boolean
    snapshot?: boolean
    createdAt?: boolean
  }

  export type ShipmentEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "shipmentId" | "eventType" | "reason" | "actorUserId" | "snapshot" | "createdAt", ExtArgs["result"]["shipmentEvent"]>
  export type ShipmentEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentEventIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }
  export type ShipmentEventIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shipment?: boolean | ShipmentDefaultArgs<ExtArgs>
  }

  export type $ShipmentEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ShipmentEvent"
    objects: {
      shipment: Prisma.$ShipmentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      shipmentId: bigint
      eventType: string
      reason: string | null
      actorUserId: string | null
      snapshot: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["shipmentEvent"]>
    composites: {}
  }

  type ShipmentEventGetPayload<S extends boolean | null | undefined | ShipmentEventDefaultArgs> = $Result.GetResult<Prisma.$ShipmentEventPayload, S>

  type ShipmentEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ShipmentEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ShipmentEventCountAggregateInputType | true
    }

  export interface ShipmentEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ShipmentEvent'], meta: { name: 'ShipmentEvent' } }
    /**
     * Find zero or one ShipmentEvent that matches the filter.
     * @param {ShipmentEventFindUniqueArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShipmentEventFindUniqueArgs>(args: SelectSubset<T, ShipmentEventFindUniqueArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ShipmentEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ShipmentEventFindUniqueOrThrowArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShipmentEventFindUniqueOrThrowArgs>(args: SelectSubset<T, ShipmentEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventFindFirstArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShipmentEventFindFirstArgs>(args?: SelectSubset<T, ShipmentEventFindFirstArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ShipmentEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventFindFirstOrThrowArgs} args - Arguments to find a ShipmentEvent
     * @example
     * // Get one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShipmentEventFindFirstOrThrowArgs>(args?: SelectSubset<T, ShipmentEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ShipmentEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ShipmentEvents
     * const shipmentEvents = await prisma.shipmentEvent.findMany()
     * 
     * // Get first 10 ShipmentEvents
     * const shipmentEvents = await prisma.shipmentEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shipmentEventWithIdOnly = await prisma.shipmentEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShipmentEventFindManyArgs>(args?: SelectSubset<T, ShipmentEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ShipmentEvent.
     * @param {ShipmentEventCreateArgs} args - Arguments to create a ShipmentEvent.
     * @example
     * // Create one ShipmentEvent
     * const ShipmentEvent = await prisma.shipmentEvent.create({
     *   data: {
     *     // ... data to create a ShipmentEvent
     *   }
     * })
     * 
     */
    create<T extends ShipmentEventCreateArgs>(args: SelectSubset<T, ShipmentEventCreateArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ShipmentEvents.
     * @param {ShipmentEventCreateManyArgs} args - Arguments to create many ShipmentEvents.
     * @example
     * // Create many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShipmentEventCreateManyArgs>(args?: SelectSubset<T, ShipmentEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ShipmentEvents and returns the data saved in the database.
     * @param {ShipmentEventCreateManyAndReturnArgs} args - Arguments to create many ShipmentEvents.
     * @example
     * // Create many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ShipmentEvents and only return the `id`
     * const shipmentEventWithIdOnly = await prisma.shipmentEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShipmentEventCreateManyAndReturnArgs>(args?: SelectSubset<T, ShipmentEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ShipmentEvent.
     * @param {ShipmentEventDeleteArgs} args - Arguments to delete one ShipmentEvent.
     * @example
     * // Delete one ShipmentEvent
     * const ShipmentEvent = await prisma.shipmentEvent.delete({
     *   where: {
     *     // ... filter to delete one ShipmentEvent
     *   }
     * })
     * 
     */
    delete<T extends ShipmentEventDeleteArgs>(args: SelectSubset<T, ShipmentEventDeleteArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ShipmentEvent.
     * @param {ShipmentEventUpdateArgs} args - Arguments to update one ShipmentEvent.
     * @example
     * // Update one ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShipmentEventUpdateArgs>(args: SelectSubset<T, ShipmentEventUpdateArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ShipmentEvents.
     * @param {ShipmentEventDeleteManyArgs} args - Arguments to filter ShipmentEvents to delete.
     * @example
     * // Delete a few ShipmentEvents
     * const { count } = await prisma.shipmentEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShipmentEventDeleteManyArgs>(args?: SelectSubset<T, ShipmentEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShipmentEventUpdateManyArgs>(args: SelectSubset<T, ShipmentEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ShipmentEvents and returns the data updated in the database.
     * @param {ShipmentEventUpdateManyAndReturnArgs} args - Arguments to update many ShipmentEvents.
     * @example
     * // Update many ShipmentEvents
     * const shipmentEvent = await prisma.shipmentEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ShipmentEvents and only return the `id`
     * const shipmentEventWithIdOnly = await prisma.shipmentEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ShipmentEventUpdateManyAndReturnArgs>(args: SelectSubset<T, ShipmentEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ShipmentEvent.
     * @param {ShipmentEventUpsertArgs} args - Arguments to update or create a ShipmentEvent.
     * @example
     * // Update or create a ShipmentEvent
     * const shipmentEvent = await prisma.shipmentEvent.upsert({
     *   create: {
     *     // ... data to create a ShipmentEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ShipmentEvent we want to update
     *   }
     * })
     */
    upsert<T extends ShipmentEventUpsertArgs>(args: SelectSubset<T, ShipmentEventUpsertArgs<ExtArgs>>): Prisma__ShipmentEventClient<$Result.GetResult<Prisma.$ShipmentEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ShipmentEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventCountArgs} args - Arguments to filter ShipmentEvents to count.
     * @example
     * // Count the number of ShipmentEvents
     * const count = await prisma.shipmentEvent.count({
     *   where: {
     *     // ... the filter for the ShipmentEvents we want to count
     *   }
     * })
    **/
    count<T extends ShipmentEventCountArgs>(
      args?: Subset<T, ShipmentEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShipmentEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ShipmentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShipmentEventAggregateArgs>(args: Subset<T, ShipmentEventAggregateArgs>): Prisma.PrismaPromise<GetShipmentEventAggregateType<T>>

    /**
     * Group by ShipmentEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShipmentEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShipmentEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShipmentEventGroupByArgs['orderBy'] }
        : { orderBy?: ShipmentEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShipmentEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShipmentEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ShipmentEvent model
   */
  readonly fields: ShipmentEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ShipmentEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShipmentEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shipment<T extends ShipmentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShipmentDefaultArgs<ExtArgs>>): Prisma__ShipmentClient<$Result.GetResult<Prisma.$ShipmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ShipmentEvent model
   */
  interface ShipmentEventFieldRefs {
    readonly id: FieldRef<"ShipmentEvent", 'BigInt'>
    readonly shipmentId: FieldRef<"ShipmentEvent", 'BigInt'>
    readonly eventType: FieldRef<"ShipmentEvent", 'String'>
    readonly reason: FieldRef<"ShipmentEvent", 'String'>
    readonly actorUserId: FieldRef<"ShipmentEvent", 'String'>
    readonly snapshot: FieldRef<"ShipmentEvent", 'Json'>
    readonly createdAt: FieldRef<"ShipmentEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ShipmentEvent findUnique
   */
  export type ShipmentEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent findUniqueOrThrow
   */
  export type ShipmentEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent findFirst
   */
  export type ShipmentEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentEvents.
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentEvents.
     */
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * ShipmentEvent findFirstOrThrow
   */
  export type ShipmentEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvent to fetch.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ShipmentEvents.
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentEvents.
     */
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * ShipmentEvent findMany
   */
  export type ShipmentEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter, which ShipmentEvents to fetch.
     */
    where?: ShipmentEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ShipmentEvents to fetch.
     */
    orderBy?: ShipmentEventOrderByWithRelationInput | ShipmentEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ShipmentEvents.
     */
    cursor?: ShipmentEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ShipmentEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ShipmentEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ShipmentEvents.
     */
    distinct?: ShipmentEventScalarFieldEnum | ShipmentEventScalarFieldEnum[]
  }

  /**
   * ShipmentEvent create
   */
  export type ShipmentEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * The data needed to create a ShipmentEvent.
     */
    data: XOR<ShipmentEventCreateInput, ShipmentEventUncheckedCreateInput>
  }

  /**
   * ShipmentEvent createMany
   */
  export type ShipmentEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ShipmentEvents.
     */
    data: ShipmentEventCreateManyInput | ShipmentEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ShipmentEvent createManyAndReturn
   */
  export type ShipmentEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * The data used to create many ShipmentEvents.
     */
    data: ShipmentEventCreateManyInput | ShipmentEventCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentEvent update
   */
  export type ShipmentEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * The data needed to update a ShipmentEvent.
     */
    data: XOR<ShipmentEventUpdateInput, ShipmentEventUncheckedUpdateInput>
    /**
     * Choose, which ShipmentEvent to update.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent updateMany
   */
  export type ShipmentEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ShipmentEvents.
     */
    data: XOR<ShipmentEventUpdateManyMutationInput, ShipmentEventUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentEvents to update
     */
    where?: ShipmentEventWhereInput
    /**
     * Limit how many ShipmentEvents to update.
     */
    limit?: number
  }

  /**
   * ShipmentEvent updateManyAndReturn
   */
  export type ShipmentEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * The data used to update ShipmentEvents.
     */
    data: XOR<ShipmentEventUpdateManyMutationInput, ShipmentEventUncheckedUpdateManyInput>
    /**
     * Filter which ShipmentEvents to update
     */
    where?: ShipmentEventWhereInput
    /**
     * Limit how many ShipmentEvents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ShipmentEvent upsert
   */
  export type ShipmentEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * The filter to search for the ShipmentEvent to update in case it exists.
     */
    where: ShipmentEventWhereUniqueInput
    /**
     * In case the ShipmentEvent found by the `where` argument doesn't exist, create a new ShipmentEvent with this data.
     */
    create: XOR<ShipmentEventCreateInput, ShipmentEventUncheckedCreateInput>
    /**
     * In case the ShipmentEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShipmentEventUpdateInput, ShipmentEventUncheckedUpdateInput>
  }

  /**
   * ShipmentEvent delete
   */
  export type ShipmentEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
    /**
     * Filter which ShipmentEvent to delete.
     */
    where: ShipmentEventWhereUniqueInput
  }

  /**
   * ShipmentEvent deleteMany
   */
  export type ShipmentEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ShipmentEvents to delete
     */
    where?: ShipmentEventWhereInput
    /**
     * Limit how many ShipmentEvents to delete.
     */
    limit?: number
  }

  /**
   * ShipmentEvent without action
   */
  export type ShipmentEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShipmentEvent
     */
    select?: ShipmentEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ShipmentEvent
     */
    omit?: ShipmentEventOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShipmentEventInclude<ExtArgs> | null
  }


  /**
   * Model AppUser
   */

  export type AggregateAppUser = {
    _count: AppUserCountAggregateOutputType | null
    _avg: AppUserAvgAggregateOutputType | null
    _sum: AppUserSumAggregateOutputType | null
    _min: AppUserMinAggregateOutputType | null
    _max: AppUserMaxAggregateOutputType | null
  }

  export type AppUserAvgAggregateOutputType = {
    partnerId: number | null
  }

  export type AppUserSumAggregateOutputType = {
    partnerId: bigint | null
  }

  export type AppUserMinAggregateOutputType = {
    userId: string | null
    email: string | null
    displayName: string | null
    role: string | null
    partnerId: bigint | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppUserMaxAggregateOutputType = {
    userId: string | null
    email: string | null
    displayName: string | null
    role: string | null
    partnerId: bigint | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppUserCountAggregateOutputType = {
    userId: number
    email: number
    displayName: number
    role: number
    partnerId: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppUserAvgAggregateInputType = {
    partnerId?: true
  }

  export type AppUserSumAggregateInputType = {
    partnerId?: true
  }

  export type AppUserMinAggregateInputType = {
    userId?: true
    email?: true
    displayName?: true
    role?: true
    partnerId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppUserMaxAggregateInputType = {
    userId?: true
    email?: true
    displayName?: true
    role?: true
    partnerId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppUserCountAggregateInputType = {
    userId?: true
    email?: true
    displayName?: true
    role?: true
    partnerId?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppUser to aggregate.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppUsers
    **/
    _count?: true | AppUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppUserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppUserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppUserMaxAggregateInputType
  }

  export type GetAppUserAggregateType<T extends AppUserAggregateArgs> = {
        [P in keyof T & keyof AggregateAppUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppUser[P]>
      : GetScalarType<T[P], AggregateAppUser[P]>
  }




  export type AppUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppUserWhereInput
    orderBy?: AppUserOrderByWithAggregationInput | AppUserOrderByWithAggregationInput[]
    by: AppUserScalarFieldEnum[] | AppUserScalarFieldEnum
    having?: AppUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppUserCountAggregateInputType | true
    _avg?: AppUserAvgAggregateInputType
    _sum?: AppUserSumAggregateInputType
    _min?: AppUserMinAggregateInputType
    _max?: AppUserMaxAggregateInputType
  }

  export type AppUserGroupByOutputType = {
    userId: string
    email: string | null
    displayName: string | null
    role: string
    partnerId: bigint | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: AppUserCountAggregateOutputType | null
    _avg: AppUserAvgAggregateOutputType | null
    _sum: AppUserSumAggregateOutputType | null
    _min: AppUserMinAggregateOutputType | null
    _max: AppUserMaxAggregateOutputType | null
  }

  type GetAppUserGroupByPayload<T extends AppUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppUserGroupByOutputType[P]>
            : GetScalarType<T[P], AppUserGroupByOutputType[P]>
        }
      >
    >


  export type AppUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    email?: boolean
    displayName?: boolean
    role?: boolean
    partnerId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    partner?: boolean | AppUser$partnerArgs<ExtArgs>
  }, ExtArgs["result"]["appUser"]>

  export type AppUserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    email?: boolean
    displayName?: boolean
    role?: boolean
    partnerId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    partner?: boolean | AppUser$partnerArgs<ExtArgs>
  }, ExtArgs["result"]["appUser"]>

  export type AppUserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    email?: boolean
    displayName?: boolean
    role?: boolean
    partnerId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    partner?: boolean | AppUser$partnerArgs<ExtArgs>
  }, ExtArgs["result"]["appUser"]>

  export type AppUserSelectScalar = {
    userId?: boolean
    email?: boolean
    displayName?: boolean
    role?: boolean
    partnerId?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "email" | "displayName" | "role" | "partnerId" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["appUser"]>
  export type AppUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | AppUser$partnerArgs<ExtArgs>
  }
  export type AppUserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | AppUser$partnerArgs<ExtArgs>
  }
  export type AppUserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | AppUser$partnerArgs<ExtArgs>
  }

  export type $AppUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppUser"
    objects: {
      partner: Prisma.$PartnerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      email: string | null
      displayName: string | null
      role: string
      partnerId: bigint | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appUser"]>
    composites: {}
  }

  type AppUserGetPayload<S extends boolean | null | undefined | AppUserDefaultArgs> = $Result.GetResult<Prisma.$AppUserPayload, S>

  type AppUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppUserCountAggregateInputType | true
    }

  export interface AppUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppUser'], meta: { name: 'AppUser' } }
    /**
     * Find zero or one AppUser that matches the filter.
     * @param {AppUserFindUniqueArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppUserFindUniqueArgs>(args: SelectSubset<T, AppUserFindUniqueArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppUserFindUniqueOrThrowArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppUserFindUniqueOrThrowArgs>(args: SelectSubset<T, AppUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserFindFirstArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppUserFindFirstArgs>(args?: SelectSubset<T, AppUserFindFirstArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserFindFirstOrThrowArgs} args - Arguments to find a AppUser
     * @example
     * // Get one AppUser
     * const appUser = await prisma.appUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppUserFindFirstOrThrowArgs>(args?: SelectSubset<T, AppUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppUsers
     * const appUsers = await prisma.appUser.findMany()
     * 
     * // Get first 10 AppUsers
     * const appUsers = await prisma.appUser.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const appUserWithUserIdOnly = await prisma.appUser.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends AppUserFindManyArgs>(args?: SelectSubset<T, AppUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppUser.
     * @param {AppUserCreateArgs} args - Arguments to create a AppUser.
     * @example
     * // Create one AppUser
     * const AppUser = await prisma.appUser.create({
     *   data: {
     *     // ... data to create a AppUser
     *   }
     * })
     * 
     */
    create<T extends AppUserCreateArgs>(args: SelectSubset<T, AppUserCreateArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppUsers.
     * @param {AppUserCreateManyArgs} args - Arguments to create many AppUsers.
     * @example
     * // Create many AppUsers
     * const appUser = await prisma.appUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppUserCreateManyArgs>(args?: SelectSubset<T, AppUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppUsers and returns the data saved in the database.
     * @param {AppUserCreateManyAndReturnArgs} args - Arguments to create many AppUsers.
     * @example
     * // Create many AppUsers
     * const appUser = await prisma.appUser.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppUsers and only return the `userId`
     * const appUserWithUserIdOnly = await prisma.appUser.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppUserCreateManyAndReturnArgs>(args?: SelectSubset<T, AppUserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppUser.
     * @param {AppUserDeleteArgs} args - Arguments to delete one AppUser.
     * @example
     * // Delete one AppUser
     * const AppUser = await prisma.appUser.delete({
     *   where: {
     *     // ... filter to delete one AppUser
     *   }
     * })
     * 
     */
    delete<T extends AppUserDeleteArgs>(args: SelectSubset<T, AppUserDeleteArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppUser.
     * @param {AppUserUpdateArgs} args - Arguments to update one AppUser.
     * @example
     * // Update one AppUser
     * const appUser = await prisma.appUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppUserUpdateArgs>(args: SelectSubset<T, AppUserUpdateArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppUsers.
     * @param {AppUserDeleteManyArgs} args - Arguments to filter AppUsers to delete.
     * @example
     * // Delete a few AppUsers
     * const { count } = await prisma.appUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppUserDeleteManyArgs>(args?: SelectSubset<T, AppUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppUsers
     * const appUser = await prisma.appUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppUserUpdateManyArgs>(args: SelectSubset<T, AppUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppUsers and returns the data updated in the database.
     * @param {AppUserUpdateManyAndReturnArgs} args - Arguments to update many AppUsers.
     * @example
     * // Update many AppUsers
     * const appUser = await prisma.appUser.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppUsers and only return the `userId`
     * const appUserWithUserIdOnly = await prisma.appUser.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppUserUpdateManyAndReturnArgs>(args: SelectSubset<T, AppUserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppUser.
     * @param {AppUserUpsertArgs} args - Arguments to update or create a AppUser.
     * @example
     * // Update or create a AppUser
     * const appUser = await prisma.appUser.upsert({
     *   create: {
     *     // ... data to create a AppUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppUser we want to update
     *   }
     * })
     */
    upsert<T extends AppUserUpsertArgs>(args: SelectSubset<T, AppUserUpsertArgs<ExtArgs>>): Prisma__AppUserClient<$Result.GetResult<Prisma.$AppUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserCountArgs} args - Arguments to filter AppUsers to count.
     * @example
     * // Count the number of AppUsers
     * const count = await prisma.appUser.count({
     *   where: {
     *     // ... the filter for the AppUsers we want to count
     *   }
     * })
    **/
    count<T extends AppUserCountArgs>(
      args?: Subset<T, AppUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppUserAggregateArgs>(args: Subset<T, AppUserAggregateArgs>): Prisma.PrismaPromise<GetAppUserAggregateType<T>>

    /**
     * Group by AppUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppUserGroupByArgs['orderBy'] }
        : { orderBy?: AppUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppUser model
   */
  readonly fields: AppUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    partner<T extends AppUser$partnerArgs<ExtArgs> = {}>(args?: Subset<T, AppUser$partnerArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppUser model
   */
  interface AppUserFieldRefs {
    readonly userId: FieldRef<"AppUser", 'String'>
    readonly email: FieldRef<"AppUser", 'String'>
    readonly displayName: FieldRef<"AppUser", 'String'>
    readonly role: FieldRef<"AppUser", 'String'>
    readonly partnerId: FieldRef<"AppUser", 'BigInt'>
    readonly active: FieldRef<"AppUser", 'Boolean'>
    readonly createdAt: FieldRef<"AppUser", 'DateTime'>
    readonly updatedAt: FieldRef<"AppUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppUser findUnique
   */
  export type AppUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser findUniqueOrThrow
   */
  export type AppUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser findFirst
   */
  export type AppUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppUsers.
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppUsers.
     */
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * AppUser findFirstOrThrow
   */
  export type AppUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUser to fetch.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppUsers.
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppUsers.
     */
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * AppUser findMany
   */
  export type AppUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter, which AppUsers to fetch.
     */
    where?: AppUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppUsers to fetch.
     */
    orderBy?: AppUserOrderByWithRelationInput | AppUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppUsers.
     */
    cursor?: AppUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppUsers.
     */
    distinct?: AppUserScalarFieldEnum | AppUserScalarFieldEnum[]
  }

  /**
   * AppUser create
   */
  export type AppUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * The data needed to create a AppUser.
     */
    data: XOR<AppUserCreateInput, AppUserUncheckedCreateInput>
  }

  /**
   * AppUser createMany
   */
  export type AppUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppUsers.
     */
    data: AppUserCreateManyInput | AppUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppUser createManyAndReturn
   */
  export type AppUserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * The data used to create many AppUsers.
     */
    data: AppUserCreateManyInput | AppUserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppUser update
   */
  export type AppUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * The data needed to update a AppUser.
     */
    data: XOR<AppUserUpdateInput, AppUserUncheckedUpdateInput>
    /**
     * Choose, which AppUser to update.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser updateMany
   */
  export type AppUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppUsers.
     */
    data: XOR<AppUserUpdateManyMutationInput, AppUserUncheckedUpdateManyInput>
    /**
     * Filter which AppUsers to update
     */
    where?: AppUserWhereInput
    /**
     * Limit how many AppUsers to update.
     */
    limit?: number
  }

  /**
   * AppUser updateManyAndReturn
   */
  export type AppUserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * The data used to update AppUsers.
     */
    data: XOR<AppUserUpdateManyMutationInput, AppUserUncheckedUpdateManyInput>
    /**
     * Filter which AppUsers to update
     */
    where?: AppUserWhereInput
    /**
     * Limit how many AppUsers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppUser upsert
   */
  export type AppUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * The filter to search for the AppUser to update in case it exists.
     */
    where: AppUserWhereUniqueInput
    /**
     * In case the AppUser found by the `where` argument doesn't exist, create a new AppUser with this data.
     */
    create: XOR<AppUserCreateInput, AppUserUncheckedCreateInput>
    /**
     * In case the AppUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppUserUpdateInput, AppUserUncheckedUpdateInput>
  }

  /**
   * AppUser delete
   */
  export type AppUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
    /**
     * Filter which AppUser to delete.
     */
    where: AppUserWhereUniqueInput
  }

  /**
   * AppUser deleteMany
   */
  export type AppUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppUsers to delete
     */
    where?: AppUserWhereInput
    /**
     * Limit how many AppUsers to delete.
     */
    limit?: number
  }

  /**
   * AppUser.partner
   */
  export type AppUser$partnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    where?: PartnerWhereInput
  }

  /**
   * AppUser without action
   */
  export type AppUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppUser
     */
    select?: AppUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppUser
     */
    omit?: AppUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppUserInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    id: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    id: bigint | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: bigint | null
    actorUserId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    requestId: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: bigint | null
    actorUserId: string | null
    action: string | null
    entityType: string | null
    entityId: string | null
    requestId: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    actorUserId: number
    action: number
    entityType: number
    entityId: number
    beforeData: number
    afterData: number
    requestId: number
    createdAt: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    id?: true
  }

  export type AuditLogSumAggregateInputType = {
    id?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    actorUserId?: true
    action?: true
    entityType?: true
    entityId?: true
    requestId?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    actorUserId?: true
    action?: true
    entityType?: true
    entityId?: true
    requestId?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    actorUserId?: true
    action?: true
    entityType?: true
    entityId?: true
    beforeData?: true
    afterData?: true
    requestId?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: bigint
    actorUserId: string | null
    action: string
    entityType: string
    entityId: string | null
    beforeData: JsonValue | null
    afterData: JsonValue | null
    requestId: string | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorUserId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    beforeData?: boolean
    afterData?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorUserId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    beforeData?: boolean
    afterData?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    actorUserId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    beforeData?: boolean
    afterData?: boolean
    requestId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    actorUserId?: boolean
    action?: boolean
    entityType?: boolean
    entityId?: boolean
    beforeData?: boolean
    afterData?: boolean
    requestId?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "actorUserId" | "action" | "entityType" | "entityId" | "beforeData" | "afterData" | "requestId" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      actorUserId: string | null
      action: string
      entityType: string
      entityId: string | null
      beforeData: Prisma.JsonValue | null
      afterData: Prisma.JsonValue | null
      requestId: string | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'BigInt'>
    readonly actorUserId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly beforeData: FieldRef<"AuditLog", 'Json'>
    readonly afterData: FieldRef<"AuditLog", 'Json'>
    readonly requestId: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model IdempotencyKey
   */

  export type AggregateIdempotencyKey = {
    _count: IdempotencyKeyCountAggregateOutputType | null
    _avg: IdempotencyKeyAvgAggregateOutputType | null
    _sum: IdempotencyKeySumAggregateOutputType | null
    _min: IdempotencyKeyMinAggregateOutputType | null
    _max: IdempotencyKeyMaxAggregateOutputType | null
  }

  export type IdempotencyKeyAvgAggregateOutputType = {
    responseCode: number | null
  }

  export type IdempotencyKeySumAggregateOutputType = {
    responseCode: number | null
  }

  export type IdempotencyKeyMinAggregateOutputType = {
    key: string | null
    userId: string | null
    route: string | null
    requestHash: string | null
    responseCode: number | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type IdempotencyKeyMaxAggregateOutputType = {
    key: string | null
    userId: string | null
    route: string | null
    requestHash: string | null
    responseCode: number | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type IdempotencyKeyCountAggregateOutputType = {
    key: number
    userId: number
    route: number
    requestHash: number
    responseCode: number
    responseBody: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type IdempotencyKeyAvgAggregateInputType = {
    responseCode?: true
  }

  export type IdempotencyKeySumAggregateInputType = {
    responseCode?: true
  }

  export type IdempotencyKeyMinAggregateInputType = {
    key?: true
    userId?: true
    route?: true
    requestHash?: true
    responseCode?: true
    createdAt?: true
    expiresAt?: true
  }

  export type IdempotencyKeyMaxAggregateInputType = {
    key?: true
    userId?: true
    route?: true
    requestHash?: true
    responseCode?: true
    createdAt?: true
    expiresAt?: true
  }

  export type IdempotencyKeyCountAggregateInputType = {
    key?: true
    userId?: true
    route?: true
    requestHash?: true
    responseCode?: true
    responseBody?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type IdempotencyKeyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdempotencyKey to aggregate.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IdempotencyKeys
    **/
    _count?: true | IdempotencyKeyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IdempotencyKeyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IdempotencyKeySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IdempotencyKeyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IdempotencyKeyMaxAggregateInputType
  }

  export type GetIdempotencyKeyAggregateType<T extends IdempotencyKeyAggregateArgs> = {
        [P in keyof T & keyof AggregateIdempotencyKey]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIdempotencyKey[P]>
      : GetScalarType<T[P], AggregateIdempotencyKey[P]>
  }




  export type IdempotencyKeyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IdempotencyKeyWhereInput
    orderBy?: IdempotencyKeyOrderByWithAggregationInput | IdempotencyKeyOrderByWithAggregationInput[]
    by: IdempotencyKeyScalarFieldEnum[] | IdempotencyKeyScalarFieldEnum
    having?: IdempotencyKeyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IdempotencyKeyCountAggregateInputType | true
    _avg?: IdempotencyKeyAvgAggregateInputType
    _sum?: IdempotencyKeySumAggregateInputType
    _min?: IdempotencyKeyMinAggregateInputType
    _max?: IdempotencyKeyMaxAggregateInputType
  }

  export type IdempotencyKeyGroupByOutputType = {
    key: string
    userId: string
    route: string
    requestHash: string
    responseCode: number | null
    responseBody: JsonValue | null
    createdAt: Date
    expiresAt: Date
    _count: IdempotencyKeyCountAggregateOutputType | null
    _avg: IdempotencyKeyAvgAggregateOutputType | null
    _sum: IdempotencyKeySumAggregateOutputType | null
    _min: IdempotencyKeyMinAggregateOutputType | null
    _max: IdempotencyKeyMaxAggregateOutputType | null
  }

  type GetIdempotencyKeyGroupByPayload<T extends IdempotencyKeyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IdempotencyKeyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IdempotencyKeyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IdempotencyKeyGroupByOutputType[P]>
            : GetScalarType<T[P], IdempotencyKeyGroupByOutputType[P]>
        }
      >
    >


  export type IdempotencyKeySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    userId?: boolean
    route?: boolean
    requestHash?: boolean
    responseCode?: boolean
    responseBody?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["idempotencyKey"]>

  export type IdempotencyKeySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    userId?: boolean
    route?: boolean
    requestHash?: boolean
    responseCode?: boolean
    responseBody?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["idempotencyKey"]>

  export type IdempotencyKeySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    key?: boolean
    userId?: boolean
    route?: boolean
    requestHash?: boolean
    responseCode?: boolean
    responseBody?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }, ExtArgs["result"]["idempotencyKey"]>

  export type IdempotencyKeySelectScalar = {
    key?: boolean
    userId?: boolean
    route?: boolean
    requestHash?: boolean
    responseCode?: boolean
    responseBody?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type IdempotencyKeyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"key" | "userId" | "route" | "requestHash" | "responseCode" | "responseBody" | "createdAt" | "expiresAt", ExtArgs["result"]["idempotencyKey"]>

  export type $IdempotencyKeyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IdempotencyKey"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      key: string
      userId: string
      route: string
      requestHash: string
      responseCode: number | null
      responseBody: Prisma.JsonValue | null
      createdAt: Date
      expiresAt: Date
    }, ExtArgs["result"]["idempotencyKey"]>
    composites: {}
  }

  type IdempotencyKeyGetPayload<S extends boolean | null | undefined | IdempotencyKeyDefaultArgs> = $Result.GetResult<Prisma.$IdempotencyKeyPayload, S>

  type IdempotencyKeyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IdempotencyKeyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IdempotencyKeyCountAggregateInputType | true
    }

  export interface IdempotencyKeyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IdempotencyKey'], meta: { name: 'IdempotencyKey' } }
    /**
     * Find zero or one IdempotencyKey that matches the filter.
     * @param {IdempotencyKeyFindUniqueArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IdempotencyKeyFindUniqueArgs>(args: SelectSubset<T, IdempotencyKeyFindUniqueArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IdempotencyKey that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IdempotencyKeyFindUniqueOrThrowArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IdempotencyKeyFindUniqueOrThrowArgs>(args: SelectSubset<T, IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IdempotencyKey that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyFindFirstArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IdempotencyKeyFindFirstArgs>(args?: SelectSubset<T, IdempotencyKeyFindFirstArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IdempotencyKey that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyFindFirstOrThrowArgs} args - Arguments to find a IdempotencyKey
     * @example
     * // Get one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IdempotencyKeyFindFirstOrThrowArgs>(args?: SelectSubset<T, IdempotencyKeyFindFirstOrThrowArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IdempotencyKeys that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IdempotencyKeys
     * const idempotencyKeys = await prisma.idempotencyKey.findMany()
     * 
     * // Get first 10 IdempotencyKeys
     * const idempotencyKeys = await prisma.idempotencyKey.findMany({ take: 10 })
     * 
     * // Only select the `key`
     * const idempotencyKeyWithKeyOnly = await prisma.idempotencyKey.findMany({ select: { key: true } })
     * 
     */
    findMany<T extends IdempotencyKeyFindManyArgs>(args?: SelectSubset<T, IdempotencyKeyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IdempotencyKey.
     * @param {IdempotencyKeyCreateArgs} args - Arguments to create a IdempotencyKey.
     * @example
     * // Create one IdempotencyKey
     * const IdempotencyKey = await prisma.idempotencyKey.create({
     *   data: {
     *     // ... data to create a IdempotencyKey
     *   }
     * })
     * 
     */
    create<T extends IdempotencyKeyCreateArgs>(args: SelectSubset<T, IdempotencyKeyCreateArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IdempotencyKeys.
     * @param {IdempotencyKeyCreateManyArgs} args - Arguments to create many IdempotencyKeys.
     * @example
     * // Create many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IdempotencyKeyCreateManyArgs>(args?: SelectSubset<T, IdempotencyKeyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IdempotencyKeys and returns the data saved in the database.
     * @param {IdempotencyKeyCreateManyAndReturnArgs} args - Arguments to create many IdempotencyKeys.
     * @example
     * // Create many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IdempotencyKeys and only return the `key`
     * const idempotencyKeyWithKeyOnly = await prisma.idempotencyKey.createManyAndReturn({
     *   select: { key: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IdempotencyKeyCreateManyAndReturnArgs>(args?: SelectSubset<T, IdempotencyKeyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IdempotencyKey.
     * @param {IdempotencyKeyDeleteArgs} args - Arguments to delete one IdempotencyKey.
     * @example
     * // Delete one IdempotencyKey
     * const IdempotencyKey = await prisma.idempotencyKey.delete({
     *   where: {
     *     // ... filter to delete one IdempotencyKey
     *   }
     * })
     * 
     */
    delete<T extends IdempotencyKeyDeleteArgs>(args: SelectSubset<T, IdempotencyKeyDeleteArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IdempotencyKey.
     * @param {IdempotencyKeyUpdateArgs} args - Arguments to update one IdempotencyKey.
     * @example
     * // Update one IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IdempotencyKeyUpdateArgs>(args: SelectSubset<T, IdempotencyKeyUpdateArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IdempotencyKeys.
     * @param {IdempotencyKeyDeleteManyArgs} args - Arguments to filter IdempotencyKeys to delete.
     * @example
     * // Delete a few IdempotencyKeys
     * const { count } = await prisma.idempotencyKey.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IdempotencyKeyDeleteManyArgs>(args?: SelectSubset<T, IdempotencyKeyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdempotencyKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IdempotencyKeyUpdateManyArgs>(args: SelectSubset<T, IdempotencyKeyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IdempotencyKeys and returns the data updated in the database.
     * @param {IdempotencyKeyUpdateManyAndReturnArgs} args - Arguments to update many IdempotencyKeys.
     * @example
     * // Update many IdempotencyKeys
     * const idempotencyKey = await prisma.idempotencyKey.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IdempotencyKeys and only return the `key`
     * const idempotencyKeyWithKeyOnly = await prisma.idempotencyKey.updateManyAndReturn({
     *   select: { key: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IdempotencyKeyUpdateManyAndReturnArgs>(args: SelectSubset<T, IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IdempotencyKey.
     * @param {IdempotencyKeyUpsertArgs} args - Arguments to update or create a IdempotencyKey.
     * @example
     * // Update or create a IdempotencyKey
     * const idempotencyKey = await prisma.idempotencyKey.upsert({
     *   create: {
     *     // ... data to create a IdempotencyKey
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IdempotencyKey we want to update
     *   }
     * })
     */
    upsert<T extends IdempotencyKeyUpsertArgs>(args: SelectSubset<T, IdempotencyKeyUpsertArgs<ExtArgs>>): Prisma__IdempotencyKeyClient<$Result.GetResult<Prisma.$IdempotencyKeyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IdempotencyKeys.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyCountArgs} args - Arguments to filter IdempotencyKeys to count.
     * @example
     * // Count the number of IdempotencyKeys
     * const count = await prisma.idempotencyKey.count({
     *   where: {
     *     // ... the filter for the IdempotencyKeys we want to count
     *   }
     * })
    **/
    count<T extends IdempotencyKeyCountArgs>(
      args?: Subset<T, IdempotencyKeyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IdempotencyKeyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IdempotencyKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IdempotencyKeyAggregateArgs>(args: Subset<T, IdempotencyKeyAggregateArgs>): Prisma.PrismaPromise<GetIdempotencyKeyAggregateType<T>>

    /**
     * Group by IdempotencyKey.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IdempotencyKeyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IdempotencyKeyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IdempotencyKeyGroupByArgs['orderBy'] }
        : { orderBy?: IdempotencyKeyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IdempotencyKeyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIdempotencyKeyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IdempotencyKey model
   */
  readonly fields: IdempotencyKeyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IdempotencyKey.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IdempotencyKeyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IdempotencyKey model
   */
  interface IdempotencyKeyFieldRefs {
    readonly key: FieldRef<"IdempotencyKey", 'String'>
    readonly userId: FieldRef<"IdempotencyKey", 'String'>
    readonly route: FieldRef<"IdempotencyKey", 'String'>
    readonly requestHash: FieldRef<"IdempotencyKey", 'String'>
    readonly responseCode: FieldRef<"IdempotencyKey", 'Int'>
    readonly responseBody: FieldRef<"IdempotencyKey", 'Json'>
    readonly createdAt: FieldRef<"IdempotencyKey", 'DateTime'>
    readonly expiresAt: FieldRef<"IdempotencyKey", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IdempotencyKey findUnique
   */
  export type IdempotencyKeyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey findUniqueOrThrow
   */
  export type IdempotencyKeyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey findFirst
   */
  export type IdempotencyKeyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdempotencyKeys.
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdempotencyKeys.
     */
    distinct?: IdempotencyKeyScalarFieldEnum | IdempotencyKeyScalarFieldEnum[]
  }

  /**
   * IdempotencyKey findFirstOrThrow
   */
  export type IdempotencyKeyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKey to fetch.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IdempotencyKeys.
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdempotencyKeys.
     */
    distinct?: IdempotencyKeyScalarFieldEnum | IdempotencyKeyScalarFieldEnum[]
  }

  /**
   * IdempotencyKey findMany
   */
  export type IdempotencyKeyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter, which IdempotencyKeys to fetch.
     */
    where?: IdempotencyKeyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IdempotencyKeys to fetch.
     */
    orderBy?: IdempotencyKeyOrderByWithRelationInput | IdempotencyKeyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IdempotencyKeys.
     */
    cursor?: IdempotencyKeyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IdempotencyKeys from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IdempotencyKeys.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IdempotencyKeys.
     */
    distinct?: IdempotencyKeyScalarFieldEnum | IdempotencyKeyScalarFieldEnum[]
  }

  /**
   * IdempotencyKey create
   */
  export type IdempotencyKeyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data needed to create a IdempotencyKey.
     */
    data: XOR<IdempotencyKeyCreateInput, IdempotencyKeyUncheckedCreateInput>
  }

  /**
   * IdempotencyKey createMany
   */
  export type IdempotencyKeyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IdempotencyKeys.
     */
    data: IdempotencyKeyCreateManyInput | IdempotencyKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IdempotencyKey createManyAndReturn
   */
  export type IdempotencyKeyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data used to create many IdempotencyKeys.
     */
    data: IdempotencyKeyCreateManyInput | IdempotencyKeyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IdempotencyKey update
   */
  export type IdempotencyKeyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data needed to update a IdempotencyKey.
     */
    data: XOR<IdempotencyKeyUpdateInput, IdempotencyKeyUncheckedUpdateInput>
    /**
     * Choose, which IdempotencyKey to update.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey updateMany
   */
  export type IdempotencyKeyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IdempotencyKeys.
     */
    data: XOR<IdempotencyKeyUpdateManyMutationInput, IdempotencyKeyUncheckedUpdateManyInput>
    /**
     * Filter which IdempotencyKeys to update
     */
    where?: IdempotencyKeyWhereInput
    /**
     * Limit how many IdempotencyKeys to update.
     */
    limit?: number
  }

  /**
   * IdempotencyKey updateManyAndReturn
   */
  export type IdempotencyKeyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The data used to update IdempotencyKeys.
     */
    data: XOR<IdempotencyKeyUpdateManyMutationInput, IdempotencyKeyUncheckedUpdateManyInput>
    /**
     * Filter which IdempotencyKeys to update
     */
    where?: IdempotencyKeyWhereInput
    /**
     * Limit how many IdempotencyKeys to update.
     */
    limit?: number
  }

  /**
   * IdempotencyKey upsert
   */
  export type IdempotencyKeyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * The filter to search for the IdempotencyKey to update in case it exists.
     */
    where: IdempotencyKeyWhereUniqueInput
    /**
     * In case the IdempotencyKey found by the `where` argument doesn't exist, create a new IdempotencyKey with this data.
     */
    create: XOR<IdempotencyKeyCreateInput, IdempotencyKeyUncheckedCreateInput>
    /**
     * In case the IdempotencyKey was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IdempotencyKeyUpdateInput, IdempotencyKeyUncheckedUpdateInput>
  }

  /**
   * IdempotencyKey delete
   */
  export type IdempotencyKeyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
    /**
     * Filter which IdempotencyKey to delete.
     */
    where: IdempotencyKeyWhereUniqueInput
  }

  /**
   * IdempotencyKey deleteMany
   */
  export type IdempotencyKeyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IdempotencyKeys to delete
     */
    where?: IdempotencyKeyWhereInput
    /**
     * Limit how many IdempotencyKeys to delete.
     */
    limit?: number
  }

  /**
   * IdempotencyKey without action
   */
  export type IdempotencyKeyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IdempotencyKey
     */
    select?: IdempotencyKeySelect<ExtArgs> | null
    /**
     * Omit specific fields from the IdempotencyKey
     */
    omit?: IdempotencyKeyOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FlavorScalarFieldEnum: {
    code: 'code',
    name: 'name',
    active: 'active',
    createdAt: 'createdAt'
  };

  export type FlavorScalarFieldEnum = (typeof FlavorScalarFieldEnum)[keyof typeof FlavorScalarFieldEnum]


  export const OperatorScalarFieldEnum: {
    id: 'id',
    name: 'name',
    active: 'active',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    version: 'version'
  };

  export type OperatorScalarFieldEnum = (typeof OperatorScalarFieldEnum)[keyof typeof OperatorScalarFieldEnum]


  export const LotScalarFieldEnum: {
    id: 'id',
    lotNumber: 'lotNumber',
    productionDate: 'productionDate',
    productionPeriod: 'productionPeriod',
    flavorCode: 'flavorCode',
    sizeMl: 'sizeMl',
    batchNo: 'batchNo',
    quantity: 'quantity',
    bestBefore: 'bestBefore',
    operatorId: 'operatorId',
    operatorName: 'operatorName',
    note: 'note',
    status: 'status',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    voidReason: 'voidReason',
    voidedBy: 'voidedBy',
    voidedAt: 'voidedAt',
    version: 'version'
  };

  export type LotScalarFieldEnum = (typeof LotScalarFieldEnum)[keyof typeof LotScalarFieldEnum]


  export const LotEventScalarFieldEnum: {
    id: 'id',
    lotId: 'lotId',
    eventType: 'eventType',
    reason: 'reason',
    actorUserId: 'actorUserId',
    snapshot: 'snapshot',
    createdAt: 'createdAt'
  };

  export type LotEventScalarFieldEnum = (typeof LotEventScalarFieldEnum)[keyof typeof LotEventScalarFieldEnum]


  export const PartnerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    billingName: 'billingName',
    taxNumber: 'taxNumber',
    shippingAddress: 'shippingAddress',
    contactName: 'contactName',
    email: 'email',
    phone: 'phone',
    note: 'note',
    active: 'active',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    version: 'version'
  };

  export type PartnerScalarFieldEnum = (typeof PartnerScalarFieldEnum)[keyof typeof PartnerScalarFieldEnum]


  export const ShipmentScalarFieldEnum: {
    id: 'id',
    shipmentNumber: 'shipmentNumber',
    shipmentYear: 'shipmentYear',
    shipmentSequence: 'shipmentSequence',
    partnerId: 'partnerId',
    shipmentDate: 'shipmentDate',
    shippingAddress: 'shippingAddress',
    customerOrderNumber: 'customerOrderNumber',
    deliveryNoteNumber: 'deliveryNoteNumber',
    note: 'note',
    status: 'status',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    closedBy: 'closedBy',
    closedAt: 'closedAt',
    shippedBy: 'shippedBy',
    shippedAt: 'shippedAt',
    voidedBy: 'voidedBy',
    voidedAt: 'voidedAt',
    voidReason: 'voidReason',
    version: 'version'
  };

  export type ShipmentScalarFieldEnum = (typeof ShipmentScalarFieldEnum)[keyof typeof ShipmentScalarFieldEnum]


  export const ShipmentItemScalarFieldEnum: {
    id: 'id',
    shipmentId: 'shipmentId',
    lotId: 'lotId',
    quantity: 'quantity',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    version: 'version'
  };

  export type ShipmentItemScalarFieldEnum = (typeof ShipmentItemScalarFieldEnum)[keyof typeof ShipmentItemScalarFieldEnum]


  export const ShipmentEventScalarFieldEnum: {
    id: 'id',
    shipmentId: 'shipmentId',
    eventType: 'eventType',
    reason: 'reason',
    actorUserId: 'actorUserId',
    snapshot: 'snapshot',
    createdAt: 'createdAt'
  };

  export type ShipmentEventScalarFieldEnum = (typeof ShipmentEventScalarFieldEnum)[keyof typeof ShipmentEventScalarFieldEnum]


  export const AppUserScalarFieldEnum: {
    userId: 'userId',
    email: 'email',
    displayName: 'displayName',
    role: 'role',
    partnerId: 'partnerId',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppUserScalarFieldEnum = (typeof AppUserScalarFieldEnum)[keyof typeof AppUserScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    actorUserId: 'actorUserId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    beforeData: 'beforeData',
    afterData: 'afterData',
    requestId: 'requestId',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const IdempotencyKeyScalarFieldEnum: {
    key: 'key',
    userId: 'userId',
    route: 'route',
    requestHash: 'requestHash',
    responseCode: 'responseCode',
    responseBody: 'responseBody',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type IdempotencyKeyScalarFieldEnum = (typeof IdempotencyKeyScalarFieldEnum)[keyof typeof IdempotencyKeyScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type FlavorWhereInput = {
    AND?: FlavorWhereInput | FlavorWhereInput[]
    OR?: FlavorWhereInput[]
    NOT?: FlavorWhereInput | FlavorWhereInput[]
    code?: StringFilter<"Flavor"> | string
    name?: StringFilter<"Flavor"> | string
    active?: BoolFilter<"Flavor"> | boolean
    createdAt?: DateTimeFilter<"Flavor"> | Date | string
    lots?: LotListRelationFilter
  }

  export type FlavorOrderByWithRelationInput = {
    code?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    lots?: LotOrderByRelationAggregateInput
  }

  export type FlavorWhereUniqueInput = Prisma.AtLeast<{
    code?: string
    name?: string
    AND?: FlavorWhereInput | FlavorWhereInput[]
    OR?: FlavorWhereInput[]
    NOT?: FlavorWhereInput | FlavorWhereInput[]
    active?: BoolFilter<"Flavor"> | boolean
    createdAt?: DateTimeFilter<"Flavor"> | Date | string
    lots?: LotListRelationFilter
  }, "code" | "name">

  export type FlavorOrderByWithAggregationInput = {
    code?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    _count?: FlavorCountOrderByAggregateInput
    _max?: FlavorMaxOrderByAggregateInput
    _min?: FlavorMinOrderByAggregateInput
  }

  export type FlavorScalarWhereWithAggregatesInput = {
    AND?: FlavorScalarWhereWithAggregatesInput | FlavorScalarWhereWithAggregatesInput[]
    OR?: FlavorScalarWhereWithAggregatesInput[]
    NOT?: FlavorScalarWhereWithAggregatesInput | FlavorScalarWhereWithAggregatesInput[]
    code?: StringWithAggregatesFilter<"Flavor"> | string
    name?: StringWithAggregatesFilter<"Flavor"> | string
    active?: BoolWithAggregatesFilter<"Flavor"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Flavor"> | Date | string
  }

  export type OperatorWhereInput = {
    AND?: OperatorWhereInput | OperatorWhereInput[]
    OR?: OperatorWhereInput[]
    NOT?: OperatorWhereInput | OperatorWhereInput[]
    id?: BigIntFilter<"Operator"> | bigint | number
    name?: StringFilter<"Operator"> | string
    active?: BoolFilter<"Operator"> | boolean
    createdBy?: UuidNullableFilter<"Operator"> | string | null
    createdAt?: DateTimeFilter<"Operator"> | Date | string
    updatedAt?: DateTimeFilter<"Operator"> | Date | string
    version?: IntFilter<"Operator"> | number
    lots?: LotListRelationFilter
  }

  export type OperatorOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    lots?: LotOrderByRelationAggregateInput
  }

  export type OperatorWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: OperatorWhereInput | OperatorWhereInput[]
    OR?: OperatorWhereInput[]
    NOT?: OperatorWhereInput | OperatorWhereInput[]
    name?: StringFilter<"Operator"> | string
    active?: BoolFilter<"Operator"> | boolean
    createdBy?: UuidNullableFilter<"Operator"> | string | null
    createdAt?: DateTimeFilter<"Operator"> | Date | string
    updatedAt?: DateTimeFilter<"Operator"> | Date | string
    version?: IntFilter<"Operator"> | number
    lots?: LotListRelationFilter
  }, "id">

  export type OperatorOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    _count?: OperatorCountOrderByAggregateInput
    _avg?: OperatorAvgOrderByAggregateInput
    _max?: OperatorMaxOrderByAggregateInput
    _min?: OperatorMinOrderByAggregateInput
    _sum?: OperatorSumOrderByAggregateInput
  }

  export type OperatorScalarWhereWithAggregatesInput = {
    AND?: OperatorScalarWhereWithAggregatesInput | OperatorScalarWhereWithAggregatesInput[]
    OR?: OperatorScalarWhereWithAggregatesInput[]
    NOT?: OperatorScalarWhereWithAggregatesInput | OperatorScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Operator"> | bigint | number
    name?: StringWithAggregatesFilter<"Operator"> | string
    active?: BoolWithAggregatesFilter<"Operator"> | boolean
    createdBy?: UuidNullableWithAggregatesFilter<"Operator"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Operator"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Operator"> | Date | string
    version?: IntWithAggregatesFilter<"Operator"> | number
  }

  export type LotWhereInput = {
    AND?: LotWhereInput | LotWhereInput[]
    OR?: LotWhereInput[]
    NOT?: LotWhereInput | LotWhereInput[]
    id?: BigIntFilter<"Lot"> | bigint | number
    lotNumber?: StringFilter<"Lot"> | string
    productionDate?: DateTimeFilter<"Lot"> | Date | string
    productionPeriod?: StringFilter<"Lot"> | string
    flavorCode?: StringFilter<"Lot"> | string
    sizeMl?: IntFilter<"Lot"> | number
    batchNo?: IntFilter<"Lot"> | number
    quantity?: IntFilter<"Lot"> | number
    bestBefore?: DateTimeFilter<"Lot"> | Date | string
    operatorId?: BigIntFilter<"Lot"> | bigint | number
    operatorName?: StringFilter<"Lot"> | string
    note?: StringNullableFilter<"Lot"> | string | null
    status?: StringFilter<"Lot"> | string
    createdBy?: UuidFilter<"Lot"> | string
    createdAt?: DateTimeFilter<"Lot"> | Date | string
    updatedAt?: DateTimeFilter<"Lot"> | Date | string
    voidReason?: StringNullableFilter<"Lot"> | string | null
    voidedBy?: UuidNullableFilter<"Lot"> | string | null
    voidedAt?: DateTimeNullableFilter<"Lot"> | Date | string | null
    version?: IntFilter<"Lot"> | number
    flavor?: XOR<FlavorScalarRelationFilter, FlavorWhereInput>
    operator?: XOR<OperatorScalarRelationFilter, OperatorWhereInput>
    events?: LotEventListRelationFilter
    shipmentItems?: ShipmentItemListRelationFilter
  }

  export type LotOrderByWithRelationInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    productionDate?: SortOrder
    productionPeriod?: SortOrder
    flavorCode?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    bestBefore?: SortOrder
    operatorId?: SortOrder
    operatorName?: SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    voidReason?: SortOrderInput | SortOrder
    voidedBy?: SortOrderInput | SortOrder
    voidedAt?: SortOrderInput | SortOrder
    version?: SortOrder
    flavor?: FlavorOrderByWithRelationInput
    operator?: OperatorOrderByWithRelationInput
    events?: LotEventOrderByRelationAggregateInput
    shipmentItems?: ShipmentItemOrderByRelationAggregateInput
  }

  export type LotWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    lotNumber?: string
    AND?: LotWhereInput | LotWhereInput[]
    OR?: LotWhereInput[]
    NOT?: LotWhereInput | LotWhereInput[]
    productionDate?: DateTimeFilter<"Lot"> | Date | string
    productionPeriod?: StringFilter<"Lot"> | string
    flavorCode?: StringFilter<"Lot"> | string
    sizeMl?: IntFilter<"Lot"> | number
    batchNo?: IntFilter<"Lot"> | number
    quantity?: IntFilter<"Lot"> | number
    bestBefore?: DateTimeFilter<"Lot"> | Date | string
    operatorId?: BigIntFilter<"Lot"> | bigint | number
    operatorName?: StringFilter<"Lot"> | string
    note?: StringNullableFilter<"Lot"> | string | null
    status?: StringFilter<"Lot"> | string
    createdBy?: UuidFilter<"Lot"> | string
    createdAt?: DateTimeFilter<"Lot"> | Date | string
    updatedAt?: DateTimeFilter<"Lot"> | Date | string
    voidReason?: StringNullableFilter<"Lot"> | string | null
    voidedBy?: UuidNullableFilter<"Lot"> | string | null
    voidedAt?: DateTimeNullableFilter<"Lot"> | Date | string | null
    version?: IntFilter<"Lot"> | number
    flavor?: XOR<FlavorScalarRelationFilter, FlavorWhereInput>
    operator?: XOR<OperatorScalarRelationFilter, OperatorWhereInput>
    events?: LotEventListRelationFilter
    shipmentItems?: ShipmentItemListRelationFilter
  }, "id" | "lotNumber">

  export type LotOrderByWithAggregationInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    productionDate?: SortOrder
    productionPeriod?: SortOrder
    flavorCode?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    bestBefore?: SortOrder
    operatorId?: SortOrder
    operatorName?: SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    voidReason?: SortOrderInput | SortOrder
    voidedBy?: SortOrderInput | SortOrder
    voidedAt?: SortOrderInput | SortOrder
    version?: SortOrder
    _count?: LotCountOrderByAggregateInput
    _avg?: LotAvgOrderByAggregateInput
    _max?: LotMaxOrderByAggregateInput
    _min?: LotMinOrderByAggregateInput
    _sum?: LotSumOrderByAggregateInput
  }

  export type LotScalarWhereWithAggregatesInput = {
    AND?: LotScalarWhereWithAggregatesInput | LotScalarWhereWithAggregatesInput[]
    OR?: LotScalarWhereWithAggregatesInput[]
    NOT?: LotScalarWhereWithAggregatesInput | LotScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Lot"> | bigint | number
    lotNumber?: StringWithAggregatesFilter<"Lot"> | string
    productionDate?: DateTimeWithAggregatesFilter<"Lot"> | Date | string
    productionPeriod?: StringWithAggregatesFilter<"Lot"> | string
    flavorCode?: StringWithAggregatesFilter<"Lot"> | string
    sizeMl?: IntWithAggregatesFilter<"Lot"> | number
    batchNo?: IntWithAggregatesFilter<"Lot"> | number
    quantity?: IntWithAggregatesFilter<"Lot"> | number
    bestBefore?: DateTimeWithAggregatesFilter<"Lot"> | Date | string
    operatorId?: BigIntWithAggregatesFilter<"Lot"> | bigint | number
    operatorName?: StringWithAggregatesFilter<"Lot"> | string
    note?: StringNullableWithAggregatesFilter<"Lot"> | string | null
    status?: StringWithAggregatesFilter<"Lot"> | string
    createdBy?: UuidWithAggregatesFilter<"Lot"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Lot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Lot"> | Date | string
    voidReason?: StringNullableWithAggregatesFilter<"Lot"> | string | null
    voidedBy?: UuidNullableWithAggregatesFilter<"Lot"> | string | null
    voidedAt?: DateTimeNullableWithAggregatesFilter<"Lot"> | Date | string | null
    version?: IntWithAggregatesFilter<"Lot"> | number
  }

  export type LotEventWhereInput = {
    AND?: LotEventWhereInput | LotEventWhereInput[]
    OR?: LotEventWhereInput[]
    NOT?: LotEventWhereInput | LotEventWhereInput[]
    id?: BigIntFilter<"LotEvent"> | bigint | number
    lotId?: BigIntFilter<"LotEvent"> | bigint | number
    eventType?: StringFilter<"LotEvent"> | string
    reason?: StringNullableFilter<"LotEvent"> | string | null
    actorUserId?: UuidNullableFilter<"LotEvent"> | string | null
    snapshot?: JsonFilter<"LotEvent">
    createdAt?: DateTimeFilter<"LotEvent"> | Date | string
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }

  export type LotEventOrderByWithRelationInput = {
    id?: SortOrder
    lotId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrderInput | SortOrder
    actorUserId?: SortOrderInput | SortOrder
    snapshot?: SortOrder
    createdAt?: SortOrder
    lot?: LotOrderByWithRelationInput
  }

  export type LotEventWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: LotEventWhereInput | LotEventWhereInput[]
    OR?: LotEventWhereInput[]
    NOT?: LotEventWhereInput | LotEventWhereInput[]
    lotId?: BigIntFilter<"LotEvent"> | bigint | number
    eventType?: StringFilter<"LotEvent"> | string
    reason?: StringNullableFilter<"LotEvent"> | string | null
    actorUserId?: UuidNullableFilter<"LotEvent"> | string | null
    snapshot?: JsonFilter<"LotEvent">
    createdAt?: DateTimeFilter<"LotEvent"> | Date | string
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }, "id">

  export type LotEventOrderByWithAggregationInput = {
    id?: SortOrder
    lotId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrderInput | SortOrder
    actorUserId?: SortOrderInput | SortOrder
    snapshot?: SortOrder
    createdAt?: SortOrder
    _count?: LotEventCountOrderByAggregateInput
    _avg?: LotEventAvgOrderByAggregateInput
    _max?: LotEventMaxOrderByAggregateInput
    _min?: LotEventMinOrderByAggregateInput
    _sum?: LotEventSumOrderByAggregateInput
  }

  export type LotEventScalarWhereWithAggregatesInput = {
    AND?: LotEventScalarWhereWithAggregatesInput | LotEventScalarWhereWithAggregatesInput[]
    OR?: LotEventScalarWhereWithAggregatesInput[]
    NOT?: LotEventScalarWhereWithAggregatesInput | LotEventScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"LotEvent"> | bigint | number
    lotId?: BigIntWithAggregatesFilter<"LotEvent"> | bigint | number
    eventType?: StringWithAggregatesFilter<"LotEvent"> | string
    reason?: StringNullableWithAggregatesFilter<"LotEvent"> | string | null
    actorUserId?: UuidNullableWithAggregatesFilter<"LotEvent"> | string | null
    snapshot?: JsonWithAggregatesFilter<"LotEvent">
    createdAt?: DateTimeWithAggregatesFilter<"LotEvent"> | Date | string
  }

  export type PartnerWhereInput = {
    AND?: PartnerWhereInput | PartnerWhereInput[]
    OR?: PartnerWhereInput[]
    NOT?: PartnerWhereInput | PartnerWhereInput[]
    id?: BigIntFilter<"Partner"> | bigint | number
    name?: StringFilter<"Partner"> | string
    billingName?: StringNullableFilter<"Partner"> | string | null
    taxNumber?: StringNullableFilter<"Partner"> | string | null
    shippingAddress?: StringNullableFilter<"Partner"> | string | null
    contactName?: StringNullableFilter<"Partner"> | string | null
    email?: StringNullableFilter<"Partner"> | string | null
    phone?: StringNullableFilter<"Partner"> | string | null
    note?: StringNullableFilter<"Partner"> | string | null
    active?: BoolFilter<"Partner"> | boolean
    createdBy?: UuidFilter<"Partner"> | string
    createdAt?: DateTimeFilter<"Partner"> | Date | string
    updatedAt?: DateTimeFilter<"Partner"> | Date | string
    version?: IntFilter<"Partner"> | number
    shipments?: ShipmentListRelationFilter
    users?: AppUserListRelationFilter
  }

  export type PartnerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    billingName?: SortOrderInput | SortOrder
    taxNumber?: SortOrderInput | SortOrder
    shippingAddress?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    shipments?: ShipmentOrderByRelationAggregateInput
    users?: AppUserOrderByRelationAggregateInput
  }

  export type PartnerWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: PartnerWhereInput | PartnerWhereInput[]
    OR?: PartnerWhereInput[]
    NOT?: PartnerWhereInput | PartnerWhereInput[]
    name?: StringFilter<"Partner"> | string
    billingName?: StringNullableFilter<"Partner"> | string | null
    taxNumber?: StringNullableFilter<"Partner"> | string | null
    shippingAddress?: StringNullableFilter<"Partner"> | string | null
    contactName?: StringNullableFilter<"Partner"> | string | null
    email?: StringNullableFilter<"Partner"> | string | null
    phone?: StringNullableFilter<"Partner"> | string | null
    note?: StringNullableFilter<"Partner"> | string | null
    active?: BoolFilter<"Partner"> | boolean
    createdBy?: UuidFilter<"Partner"> | string
    createdAt?: DateTimeFilter<"Partner"> | Date | string
    updatedAt?: DateTimeFilter<"Partner"> | Date | string
    version?: IntFilter<"Partner"> | number
    shipments?: ShipmentListRelationFilter
    users?: AppUserListRelationFilter
  }, "id">

  export type PartnerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    billingName?: SortOrderInput | SortOrder
    taxNumber?: SortOrderInput | SortOrder
    shippingAddress?: SortOrderInput | SortOrder
    contactName?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    _count?: PartnerCountOrderByAggregateInput
    _avg?: PartnerAvgOrderByAggregateInput
    _max?: PartnerMaxOrderByAggregateInput
    _min?: PartnerMinOrderByAggregateInput
    _sum?: PartnerSumOrderByAggregateInput
  }

  export type PartnerScalarWhereWithAggregatesInput = {
    AND?: PartnerScalarWhereWithAggregatesInput | PartnerScalarWhereWithAggregatesInput[]
    OR?: PartnerScalarWhereWithAggregatesInput[]
    NOT?: PartnerScalarWhereWithAggregatesInput | PartnerScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Partner"> | bigint | number
    name?: StringWithAggregatesFilter<"Partner"> | string
    billingName?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    taxNumber?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    shippingAddress?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    contactName?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    email?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    note?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    active?: BoolWithAggregatesFilter<"Partner"> | boolean
    createdBy?: UuidWithAggregatesFilter<"Partner"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Partner"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Partner"> | Date | string
    version?: IntWithAggregatesFilter<"Partner"> | number
  }

  export type ShipmentWhereInput = {
    AND?: ShipmentWhereInput | ShipmentWhereInput[]
    OR?: ShipmentWhereInput[]
    NOT?: ShipmentWhereInput | ShipmentWhereInput[]
    id?: BigIntFilter<"Shipment"> | bigint | number
    shipmentNumber?: StringFilter<"Shipment"> | string
    shipmentYear?: IntFilter<"Shipment"> | number
    shipmentSequence?: IntFilter<"Shipment"> | number
    partnerId?: BigIntFilter<"Shipment"> | bigint | number
    shipmentDate?: DateTimeFilter<"Shipment"> | Date | string
    shippingAddress?: StringNullableFilter<"Shipment"> | string | null
    customerOrderNumber?: StringNullableFilter<"Shipment"> | string | null
    deliveryNoteNumber?: StringNullableFilter<"Shipment"> | string | null
    note?: StringNullableFilter<"Shipment"> | string | null
    status?: StringFilter<"Shipment"> | string
    createdBy?: UuidFilter<"Shipment"> | string
    createdAt?: DateTimeFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeFilter<"Shipment"> | Date | string
    closedBy?: UuidNullableFilter<"Shipment"> | string | null
    closedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippedBy?: UuidNullableFilter<"Shipment"> | string | null
    shippedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    voidedBy?: UuidNullableFilter<"Shipment"> | string | null
    voidedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    voidReason?: StringNullableFilter<"Shipment"> | string | null
    version?: IntFilter<"Shipment"> | number
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
    items?: ShipmentItemListRelationFilter
    events?: ShipmentEventListRelationFilter
  }

  export type ShipmentOrderByWithRelationInput = {
    id?: SortOrder
    shipmentNumber?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    shipmentDate?: SortOrder
    shippingAddress?: SortOrderInput | SortOrder
    customerOrderNumber?: SortOrderInput | SortOrder
    deliveryNoteNumber?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedBy?: SortOrderInput | SortOrder
    closedAt?: SortOrderInput | SortOrder
    shippedBy?: SortOrderInput | SortOrder
    shippedAt?: SortOrderInput | SortOrder
    voidedBy?: SortOrderInput | SortOrder
    voidedAt?: SortOrderInput | SortOrder
    voidReason?: SortOrderInput | SortOrder
    version?: SortOrder
    partner?: PartnerOrderByWithRelationInput
    items?: ShipmentItemOrderByRelationAggregateInput
    events?: ShipmentEventOrderByRelationAggregateInput
  }

  export type ShipmentWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    shipmentNumber?: string
    shipmentYear_shipmentSequence?: ShipmentShipmentYearShipmentSequenceCompoundUniqueInput
    AND?: ShipmentWhereInput | ShipmentWhereInput[]
    OR?: ShipmentWhereInput[]
    NOT?: ShipmentWhereInput | ShipmentWhereInput[]
    shipmentYear?: IntFilter<"Shipment"> | number
    shipmentSequence?: IntFilter<"Shipment"> | number
    partnerId?: BigIntFilter<"Shipment"> | bigint | number
    shipmentDate?: DateTimeFilter<"Shipment"> | Date | string
    shippingAddress?: StringNullableFilter<"Shipment"> | string | null
    customerOrderNumber?: StringNullableFilter<"Shipment"> | string | null
    deliveryNoteNumber?: StringNullableFilter<"Shipment"> | string | null
    note?: StringNullableFilter<"Shipment"> | string | null
    status?: StringFilter<"Shipment"> | string
    createdBy?: UuidFilter<"Shipment"> | string
    createdAt?: DateTimeFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeFilter<"Shipment"> | Date | string
    closedBy?: UuidNullableFilter<"Shipment"> | string | null
    closedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippedBy?: UuidNullableFilter<"Shipment"> | string | null
    shippedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    voidedBy?: UuidNullableFilter<"Shipment"> | string | null
    voidedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    voidReason?: StringNullableFilter<"Shipment"> | string | null
    version?: IntFilter<"Shipment"> | number
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
    items?: ShipmentItemListRelationFilter
    events?: ShipmentEventListRelationFilter
  }, "id" | "shipmentNumber" | "shipmentYear_shipmentSequence">

  export type ShipmentOrderByWithAggregationInput = {
    id?: SortOrder
    shipmentNumber?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    shipmentDate?: SortOrder
    shippingAddress?: SortOrderInput | SortOrder
    customerOrderNumber?: SortOrderInput | SortOrder
    deliveryNoteNumber?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedBy?: SortOrderInput | SortOrder
    closedAt?: SortOrderInput | SortOrder
    shippedBy?: SortOrderInput | SortOrder
    shippedAt?: SortOrderInput | SortOrder
    voidedBy?: SortOrderInput | SortOrder
    voidedAt?: SortOrderInput | SortOrder
    voidReason?: SortOrderInput | SortOrder
    version?: SortOrder
    _count?: ShipmentCountOrderByAggregateInput
    _avg?: ShipmentAvgOrderByAggregateInput
    _max?: ShipmentMaxOrderByAggregateInput
    _min?: ShipmentMinOrderByAggregateInput
    _sum?: ShipmentSumOrderByAggregateInput
  }

  export type ShipmentScalarWhereWithAggregatesInput = {
    AND?: ShipmentScalarWhereWithAggregatesInput | ShipmentScalarWhereWithAggregatesInput[]
    OR?: ShipmentScalarWhereWithAggregatesInput[]
    NOT?: ShipmentScalarWhereWithAggregatesInput | ShipmentScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Shipment"> | bigint | number
    shipmentNumber?: StringWithAggregatesFilter<"Shipment"> | string
    shipmentYear?: IntWithAggregatesFilter<"Shipment"> | number
    shipmentSequence?: IntWithAggregatesFilter<"Shipment"> | number
    partnerId?: BigIntWithAggregatesFilter<"Shipment"> | bigint | number
    shipmentDate?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
    shippingAddress?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    customerOrderNumber?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    deliveryNoteNumber?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    note?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    status?: StringWithAggregatesFilter<"Shipment"> | string
    createdBy?: UuidWithAggregatesFilter<"Shipment"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Shipment"> | Date | string
    closedBy?: UuidNullableWithAggregatesFilter<"Shipment"> | string | null
    closedAt?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    shippedBy?: UuidNullableWithAggregatesFilter<"Shipment"> | string | null
    shippedAt?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    voidedBy?: UuidNullableWithAggregatesFilter<"Shipment"> | string | null
    voidedAt?: DateTimeNullableWithAggregatesFilter<"Shipment"> | Date | string | null
    voidReason?: StringNullableWithAggregatesFilter<"Shipment"> | string | null
    version?: IntWithAggregatesFilter<"Shipment"> | number
  }

  export type ShipmentItemWhereInput = {
    AND?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    OR?: ShipmentItemWhereInput[]
    NOT?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    id?: BigIntFilter<"ShipmentItem"> | bigint | number
    shipmentId?: BigIntFilter<"ShipmentItem"> | bigint | number
    lotId?: BigIntFilter<"ShipmentItem"> | bigint | number
    quantity?: IntFilter<"ShipmentItem"> | number
    createdBy?: UuidFilter<"ShipmentItem"> | string
    createdAt?: DateTimeFilter<"ShipmentItem"> | Date | string
    updatedAt?: DateTimeFilter<"ShipmentItem"> | Date | string
    version?: IntFilter<"ShipmentItem"> | number
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }

  export type ShipmentItemOrderByWithRelationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    shipment?: ShipmentOrderByWithRelationInput
    lot?: LotOrderByWithRelationInput
  }

  export type ShipmentItemWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    shipmentId_lotId?: ShipmentItemShipmentIdLotIdCompoundUniqueInput
    AND?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    OR?: ShipmentItemWhereInput[]
    NOT?: ShipmentItemWhereInput | ShipmentItemWhereInput[]
    shipmentId?: BigIntFilter<"ShipmentItem"> | bigint | number
    lotId?: BigIntFilter<"ShipmentItem"> | bigint | number
    quantity?: IntFilter<"ShipmentItem"> | number
    createdBy?: UuidFilter<"ShipmentItem"> | string
    createdAt?: DateTimeFilter<"ShipmentItem"> | Date | string
    updatedAt?: DateTimeFilter<"ShipmentItem"> | Date | string
    version?: IntFilter<"ShipmentItem"> | number
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
    lot?: XOR<LotScalarRelationFilter, LotWhereInput>
  }, "id" | "shipmentId_lotId">

  export type ShipmentItemOrderByWithAggregationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
    _count?: ShipmentItemCountOrderByAggregateInput
    _avg?: ShipmentItemAvgOrderByAggregateInput
    _max?: ShipmentItemMaxOrderByAggregateInput
    _min?: ShipmentItemMinOrderByAggregateInput
    _sum?: ShipmentItemSumOrderByAggregateInput
  }

  export type ShipmentItemScalarWhereWithAggregatesInput = {
    AND?: ShipmentItemScalarWhereWithAggregatesInput | ShipmentItemScalarWhereWithAggregatesInput[]
    OR?: ShipmentItemScalarWhereWithAggregatesInput[]
    NOT?: ShipmentItemScalarWhereWithAggregatesInput | ShipmentItemScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"ShipmentItem"> | bigint | number
    shipmentId?: BigIntWithAggregatesFilter<"ShipmentItem"> | bigint | number
    lotId?: BigIntWithAggregatesFilter<"ShipmentItem"> | bigint | number
    quantity?: IntWithAggregatesFilter<"ShipmentItem"> | number
    createdBy?: UuidWithAggregatesFilter<"ShipmentItem"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ShipmentItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ShipmentItem"> | Date | string
    version?: IntWithAggregatesFilter<"ShipmentItem"> | number
  }

  export type ShipmentEventWhereInput = {
    AND?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    OR?: ShipmentEventWhereInput[]
    NOT?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    id?: BigIntFilter<"ShipmentEvent"> | bigint | number
    shipmentId?: BigIntFilter<"ShipmentEvent"> | bigint | number
    eventType?: StringFilter<"ShipmentEvent"> | string
    reason?: StringNullableFilter<"ShipmentEvent"> | string | null
    actorUserId?: UuidNullableFilter<"ShipmentEvent"> | string | null
    snapshot?: JsonFilter<"ShipmentEvent">
    createdAt?: DateTimeFilter<"ShipmentEvent"> | Date | string
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
  }

  export type ShipmentEventOrderByWithRelationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrderInput | SortOrder
    actorUserId?: SortOrderInput | SortOrder
    snapshot?: SortOrder
    createdAt?: SortOrder
    shipment?: ShipmentOrderByWithRelationInput
  }

  export type ShipmentEventWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    OR?: ShipmentEventWhereInput[]
    NOT?: ShipmentEventWhereInput | ShipmentEventWhereInput[]
    shipmentId?: BigIntFilter<"ShipmentEvent"> | bigint | number
    eventType?: StringFilter<"ShipmentEvent"> | string
    reason?: StringNullableFilter<"ShipmentEvent"> | string | null
    actorUserId?: UuidNullableFilter<"ShipmentEvent"> | string | null
    snapshot?: JsonFilter<"ShipmentEvent">
    createdAt?: DateTimeFilter<"ShipmentEvent"> | Date | string
    shipment?: XOR<ShipmentScalarRelationFilter, ShipmentWhereInput>
  }, "id">

  export type ShipmentEventOrderByWithAggregationInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrderInput | SortOrder
    actorUserId?: SortOrderInput | SortOrder
    snapshot?: SortOrder
    createdAt?: SortOrder
    _count?: ShipmentEventCountOrderByAggregateInput
    _avg?: ShipmentEventAvgOrderByAggregateInput
    _max?: ShipmentEventMaxOrderByAggregateInput
    _min?: ShipmentEventMinOrderByAggregateInput
    _sum?: ShipmentEventSumOrderByAggregateInput
  }

  export type ShipmentEventScalarWhereWithAggregatesInput = {
    AND?: ShipmentEventScalarWhereWithAggregatesInput | ShipmentEventScalarWhereWithAggregatesInput[]
    OR?: ShipmentEventScalarWhereWithAggregatesInput[]
    NOT?: ShipmentEventScalarWhereWithAggregatesInput | ShipmentEventScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"ShipmentEvent"> | bigint | number
    shipmentId?: BigIntWithAggregatesFilter<"ShipmentEvent"> | bigint | number
    eventType?: StringWithAggregatesFilter<"ShipmentEvent"> | string
    reason?: StringNullableWithAggregatesFilter<"ShipmentEvent"> | string | null
    actorUserId?: UuidNullableWithAggregatesFilter<"ShipmentEvent"> | string | null
    snapshot?: JsonWithAggregatesFilter<"ShipmentEvent">
    createdAt?: DateTimeWithAggregatesFilter<"ShipmentEvent"> | Date | string
  }

  export type AppUserWhereInput = {
    AND?: AppUserWhereInput | AppUserWhereInput[]
    OR?: AppUserWhereInput[]
    NOT?: AppUserWhereInput | AppUserWhereInput[]
    userId?: UuidFilter<"AppUser"> | string
    email?: StringNullableFilter<"AppUser"> | string | null
    displayName?: StringNullableFilter<"AppUser"> | string | null
    role?: StringFilter<"AppUser"> | string
    partnerId?: BigIntNullableFilter<"AppUser"> | bigint | number | null
    active?: BoolFilter<"AppUser"> | boolean
    createdAt?: DateTimeFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeFilter<"AppUser"> | Date | string
    partner?: XOR<PartnerNullableScalarRelationFilter, PartnerWhereInput> | null
  }

  export type AppUserOrderByWithRelationInput = {
    userId?: SortOrder
    email?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    role?: SortOrder
    partnerId?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    partner?: PartnerOrderByWithRelationInput
  }

  export type AppUserWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: AppUserWhereInput | AppUserWhereInput[]
    OR?: AppUserWhereInput[]
    NOT?: AppUserWhereInput | AppUserWhereInput[]
    email?: StringNullableFilter<"AppUser"> | string | null
    displayName?: StringNullableFilter<"AppUser"> | string | null
    role?: StringFilter<"AppUser"> | string
    partnerId?: BigIntNullableFilter<"AppUser"> | bigint | number | null
    active?: BoolFilter<"AppUser"> | boolean
    createdAt?: DateTimeFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeFilter<"AppUser"> | Date | string
    partner?: XOR<PartnerNullableScalarRelationFilter, PartnerWhereInput> | null
  }, "userId">

  export type AppUserOrderByWithAggregationInput = {
    userId?: SortOrder
    email?: SortOrderInput | SortOrder
    displayName?: SortOrderInput | SortOrder
    role?: SortOrder
    partnerId?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppUserCountOrderByAggregateInput
    _avg?: AppUserAvgOrderByAggregateInput
    _max?: AppUserMaxOrderByAggregateInput
    _min?: AppUserMinOrderByAggregateInput
    _sum?: AppUserSumOrderByAggregateInput
  }

  export type AppUserScalarWhereWithAggregatesInput = {
    AND?: AppUserScalarWhereWithAggregatesInput | AppUserScalarWhereWithAggregatesInput[]
    OR?: AppUserScalarWhereWithAggregatesInput[]
    NOT?: AppUserScalarWhereWithAggregatesInput | AppUserScalarWhereWithAggregatesInput[]
    userId?: UuidWithAggregatesFilter<"AppUser"> | string
    email?: StringNullableWithAggregatesFilter<"AppUser"> | string | null
    displayName?: StringNullableWithAggregatesFilter<"AppUser"> | string | null
    role?: StringWithAggregatesFilter<"AppUser"> | string
    partnerId?: BigIntNullableWithAggregatesFilter<"AppUser"> | bigint | number | null
    active?: BoolWithAggregatesFilter<"AppUser"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AppUser"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: BigIntFilter<"AuditLog"> | bigint | number
    actorUserId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    beforeData?: JsonNullableFilter<"AuditLog">
    afterData?: JsonNullableFilter<"AuditLog">
    requestId?: UuidNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    actorUserId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    beforeData?: SortOrderInput | SortOrder
    afterData?: SortOrderInput | SortOrder
    requestId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    actorUserId?: UuidNullableFilter<"AuditLog"> | string | null
    action?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    beforeData?: JsonNullableFilter<"AuditLog">
    afterData?: JsonNullableFilter<"AuditLog">
    requestId?: UuidNullableFilter<"AuditLog"> | string | null
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    actorUserId?: SortOrderInput | SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    beforeData?: SortOrderInput | SortOrder
    afterData?: SortOrderInput | SortOrder
    requestId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"AuditLog"> | bigint | number
    actorUserId?: UuidNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    beforeData?: JsonNullableWithAggregatesFilter<"AuditLog">
    afterData?: JsonNullableWithAggregatesFilter<"AuditLog">
    requestId?: UuidNullableWithAggregatesFilter<"AuditLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type IdempotencyKeyWhereInput = {
    AND?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
    OR?: IdempotencyKeyWhereInput[]
    NOT?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
    key?: UuidFilter<"IdempotencyKey"> | string
    userId?: UuidFilter<"IdempotencyKey"> | string
    route?: StringFilter<"IdempotencyKey"> | string
    requestHash?: StringFilter<"IdempotencyKey"> | string
    responseCode?: IntNullableFilter<"IdempotencyKey"> | number | null
    responseBody?: JsonNullableFilter<"IdempotencyKey">
    createdAt?: DateTimeFilter<"IdempotencyKey"> | Date | string
    expiresAt?: DateTimeFilter<"IdempotencyKey"> | Date | string
  }

  export type IdempotencyKeyOrderByWithRelationInput = {
    key?: SortOrder
    userId?: SortOrder
    route?: SortOrder
    requestHash?: SortOrder
    responseCode?: SortOrderInput | SortOrder
    responseBody?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type IdempotencyKeyWhereUniqueInput = Prisma.AtLeast<{
    key?: string
    AND?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
    OR?: IdempotencyKeyWhereInput[]
    NOT?: IdempotencyKeyWhereInput | IdempotencyKeyWhereInput[]
    userId?: UuidFilter<"IdempotencyKey"> | string
    route?: StringFilter<"IdempotencyKey"> | string
    requestHash?: StringFilter<"IdempotencyKey"> | string
    responseCode?: IntNullableFilter<"IdempotencyKey"> | number | null
    responseBody?: JsonNullableFilter<"IdempotencyKey">
    createdAt?: DateTimeFilter<"IdempotencyKey"> | Date | string
    expiresAt?: DateTimeFilter<"IdempotencyKey"> | Date | string
  }, "key">

  export type IdempotencyKeyOrderByWithAggregationInput = {
    key?: SortOrder
    userId?: SortOrder
    route?: SortOrder
    requestHash?: SortOrder
    responseCode?: SortOrderInput | SortOrder
    responseBody?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    _count?: IdempotencyKeyCountOrderByAggregateInput
    _avg?: IdempotencyKeyAvgOrderByAggregateInput
    _max?: IdempotencyKeyMaxOrderByAggregateInput
    _min?: IdempotencyKeyMinOrderByAggregateInput
    _sum?: IdempotencyKeySumOrderByAggregateInput
  }

  export type IdempotencyKeyScalarWhereWithAggregatesInput = {
    AND?: IdempotencyKeyScalarWhereWithAggregatesInput | IdempotencyKeyScalarWhereWithAggregatesInput[]
    OR?: IdempotencyKeyScalarWhereWithAggregatesInput[]
    NOT?: IdempotencyKeyScalarWhereWithAggregatesInput | IdempotencyKeyScalarWhereWithAggregatesInput[]
    key?: UuidWithAggregatesFilter<"IdempotencyKey"> | string
    userId?: UuidWithAggregatesFilter<"IdempotencyKey"> | string
    route?: StringWithAggregatesFilter<"IdempotencyKey"> | string
    requestHash?: StringWithAggregatesFilter<"IdempotencyKey"> | string
    responseCode?: IntNullableWithAggregatesFilter<"IdempotencyKey"> | number | null
    responseBody?: JsonNullableWithAggregatesFilter<"IdempotencyKey">
    createdAt?: DateTimeWithAggregatesFilter<"IdempotencyKey"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"IdempotencyKey"> | Date | string
  }

  export type FlavorCreateInput = {
    code: string
    name: string
    active?: boolean
    createdAt?: Date | string
    lots?: LotCreateNestedManyWithoutFlavorInput
  }

  export type FlavorUncheckedCreateInput = {
    code: string
    name: string
    active?: boolean
    createdAt?: Date | string
    lots?: LotUncheckedCreateNestedManyWithoutFlavorInput
  }

  export type FlavorUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lots?: LotUpdateManyWithoutFlavorNestedInput
  }

  export type FlavorUncheckedUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lots?: LotUncheckedUpdateManyWithoutFlavorNestedInput
  }

  export type FlavorCreateManyInput = {
    code: string
    name: string
    active?: boolean
    createdAt?: Date | string
  }

  export type FlavorUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlavorUncheckedUpdateManyInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatorCreateInput = {
    id?: bigint | number
    name: string
    active?: boolean
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    lots?: LotCreateNestedManyWithoutOperatorInput
  }

  export type OperatorUncheckedCreateInput = {
    id?: bigint | number
    name: string
    active?: boolean
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    lots?: LotUncheckedCreateNestedManyWithoutOperatorInput
  }

  export type OperatorUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    lots?: LotUpdateManyWithoutOperatorNestedInput
  }

  export type OperatorUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    lots?: LotUncheckedUpdateManyWithoutOperatorNestedInput
  }

  export type OperatorCreateManyInput = {
    id?: bigint | number
    name: string
    active?: boolean
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type OperatorUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type OperatorUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type LotCreateInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    flavor: FlavorCreateNestedOneWithoutLotsInput
    operator: OperatorCreateNestedOneWithoutLotsInput
    events?: LotEventCreateNestedManyWithoutLotInput
    shipmentItems?: ShipmentItemCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorId: bigint | number
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    events?: LotEventUncheckedCreateNestedManyWithoutLotInput
    shipmentItems?: ShipmentItemUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    flavor?: FlavorUpdateOneRequiredWithoutLotsNestedInput
    operator?: OperatorUpdateOneRequiredWithoutLotsNestedInput
    events?: LotEventUpdateManyWithoutLotNestedInput
    shipmentItems?: ShipmentItemUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    flavorCode?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorId?: BigIntFieldUpdateOperationsInput | bigint | number
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    events?: LotEventUncheckedUpdateManyWithoutLotNestedInput
    shipmentItems?: ShipmentItemUncheckedUpdateManyWithoutLotNestedInput
  }

  export type LotCreateManyInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorId: bigint | number
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
  }

  export type LotUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type LotUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    flavorCode?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorId?: BigIntFieldUpdateOperationsInput | bigint | number
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type LotEventCreateInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    lot: LotCreateNestedOneWithoutEventsInput
  }

  export type LotEventUncheckedCreateInput = {
    id?: bigint | number
    lotId: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LotEventUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lot?: LotUpdateOneRequiredWithoutEventsNestedInput
  }

  export type LotEventUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotId?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotEventCreateManyInput = {
    id?: bigint | number
    lotId: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LotEventUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotEventUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotId?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerCreateInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    shipments?: ShipmentCreateNestedManyWithoutPartnerInput
    users?: AppUserCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    shipments?: ShipmentUncheckedCreateNestedManyWithoutPartnerInput
    users?: AppUserUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    shipments?: ShipmentUpdateManyWithoutPartnerNestedInput
    users?: AppUserUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    shipments?: ShipmentUncheckedUpdateManyWithoutPartnerNestedInput
    users?: AppUserUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerCreateManyInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type PartnerUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type PartnerUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentCreateInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    partner: PartnerCreateNestedOneWithoutShipmentsInput
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
    events?: ShipmentEventCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    partnerId: bigint | number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
    events?: ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    partner?: PartnerUpdateOneRequiredWithoutShipmentsNestedInput
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
    events?: ShipmentEventUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    partnerId?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
    events?: ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentCreateManyInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    partnerId: bigint | number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
  }

  export type ShipmentUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    partnerId?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemCreateInput = {
    id?: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    shipment: ShipmentCreateNestedOneWithoutItemsInput
    lot: LotCreateNestedOneWithoutShipmentItemsInput
  }

  export type ShipmentItemUncheckedCreateInput = {
    id?: bigint | number
    shipmentId: bigint | number
    lotId: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type ShipmentItemUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    shipment?: ShipmentUpdateOneRequiredWithoutItemsNestedInput
    lot?: LotUpdateOneRequiredWithoutShipmentItemsNestedInput
  }

  export type ShipmentItemUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentId?: BigIntFieldUpdateOperationsInput | bigint | number
    lotId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemCreateManyInput = {
    id?: bigint | number
    shipmentId: bigint | number
    lotId: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type ShipmentItemUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentId?: BigIntFieldUpdateOperationsInput | bigint | number
    lotId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentEventCreateInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    shipment: ShipmentCreateNestedOneWithoutEventsInput
  }

  export type ShipmentEventUncheckedCreateInput = {
    id?: bigint | number
    shipmentId: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ShipmentEventUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    shipment?: ShipmentUpdateOneRequiredWithoutEventsNestedInput
  }

  export type ShipmentEventUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentId?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventCreateManyInput = {
    id?: bigint | number
    shipmentId: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ShipmentEventUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentId?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppUserCreateInput = {
    userId: string
    email?: string | null
    displayName?: string | null
    role?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    partner?: PartnerCreateNestedOneWithoutUsersInput
  }

  export type AppUserUncheckedCreateInput = {
    userId: string
    email?: string | null
    displayName?: string | null
    role?: string
    partnerId?: bigint | number | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppUserUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partner?: PartnerUpdateOneWithoutUsersNestedInput
  }

  export type AppUserUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    partnerId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppUserCreateManyInput = {
    userId: string
    email?: string | null
    displayName?: string | null
    role?: string
    partnerId?: bigint | number | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppUserUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppUserUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    partnerId?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: bigint | number
    actorUserId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id?: bigint | number
    actorUserId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: bigint | number
    actorUserId?: string | null
    action: string
    entityType: string
    entityId?: string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: string | null
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    beforeData?: NullableJsonNullValueInput | InputJsonValue
    afterData?: NullableJsonNullValueInput | InputJsonValue
    requestId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyCreateInput = {
    key: string
    userId: string
    route: string
    requestHash: string
    responseCode?: number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type IdempotencyKeyUncheckedCreateInput = {
    key: string
    userId: string
    route: string
    requestHash: string
    responseCode?: number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type IdempotencyKeyUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyUncheckedUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyCreateManyInput = {
    key: string
    userId: string
    route: string
    requestHash: string
    responseCode?: number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    expiresAt: Date | string
  }

  export type IdempotencyKeyUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IdempotencyKeyUncheckedUpdateManyInput = {
    key?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    route?: StringFieldUpdateOperationsInput | string
    requestHash?: StringFieldUpdateOperationsInput | string
    responseCode?: NullableIntFieldUpdateOperationsInput | number | null
    responseBody?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LotListRelationFilter = {
    every?: LotWhereInput
    some?: LotWhereInput
    none?: LotWhereInput
  }

  export type LotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlavorCountOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
  }

  export type FlavorMaxOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
  }

  export type FlavorMinOrderByAggregateInput = {
    code?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type OperatorCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type OperatorAvgOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
  }

  export type OperatorMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type OperatorMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type OperatorSumOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FlavorScalarRelationFilter = {
    is?: FlavorWhereInput
    isNot?: FlavorWhereInput
  }

  export type OperatorScalarRelationFilter = {
    is?: OperatorWhereInput
    isNot?: OperatorWhereInput
  }

  export type LotEventListRelationFilter = {
    every?: LotEventWhereInput
    some?: LotEventWhereInput
    none?: LotEventWhereInput
  }

  export type ShipmentItemListRelationFilter = {
    every?: ShipmentItemWhereInput
    some?: ShipmentItemWhereInput
    none?: ShipmentItemWhereInput
  }

  export type LotEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LotCountOrderByAggregateInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    productionDate?: SortOrder
    productionPeriod?: SortOrder
    flavorCode?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    bestBefore?: SortOrder
    operatorId?: SortOrder
    operatorName?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    voidReason?: SortOrder
    voidedBy?: SortOrder
    voidedAt?: SortOrder
    version?: SortOrder
  }

  export type LotAvgOrderByAggregateInput = {
    id?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    operatorId?: SortOrder
    version?: SortOrder
  }

  export type LotMaxOrderByAggregateInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    productionDate?: SortOrder
    productionPeriod?: SortOrder
    flavorCode?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    bestBefore?: SortOrder
    operatorId?: SortOrder
    operatorName?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    voidReason?: SortOrder
    voidedBy?: SortOrder
    voidedAt?: SortOrder
    version?: SortOrder
  }

  export type LotMinOrderByAggregateInput = {
    id?: SortOrder
    lotNumber?: SortOrder
    productionDate?: SortOrder
    productionPeriod?: SortOrder
    flavorCode?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    bestBefore?: SortOrder
    operatorId?: SortOrder
    operatorName?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    voidReason?: SortOrder
    voidedBy?: SortOrder
    voidedAt?: SortOrder
    version?: SortOrder
  }

  export type LotSumOrderByAggregateInput = {
    id?: SortOrder
    sizeMl?: SortOrder
    batchNo?: SortOrder
    quantity?: SortOrder
    operatorId?: SortOrder
    version?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LotScalarRelationFilter = {
    is?: LotWhereInput
    isNot?: LotWhereInput
  }

  export type LotEventCountOrderByAggregateInput = {
    id?: SortOrder
    lotId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrder
    actorUserId?: SortOrder
    snapshot?: SortOrder
    createdAt?: SortOrder
  }

  export type LotEventAvgOrderByAggregateInput = {
    id?: SortOrder
    lotId?: SortOrder
  }

  export type LotEventMaxOrderByAggregateInput = {
    id?: SortOrder
    lotId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrder
    actorUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type LotEventMinOrderByAggregateInput = {
    id?: SortOrder
    lotId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrder
    actorUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type LotEventSumOrderByAggregateInput = {
    id?: SortOrder
    lotId?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type ShipmentListRelationFilter = {
    every?: ShipmentWhereInput
    some?: ShipmentWhereInput
    none?: ShipmentWhereInput
  }

  export type AppUserListRelationFilter = {
    every?: AppUserWhereInput
    some?: AppUserWhereInput
    none?: AppUserWhereInput
  }

  export type ShipmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppUserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PartnerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    billingName?: SortOrder
    taxNumber?: SortOrder
    shippingAddress?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    note?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type PartnerAvgOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
  }

  export type PartnerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    billingName?: SortOrder
    taxNumber?: SortOrder
    shippingAddress?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    note?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type PartnerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    billingName?: SortOrder
    taxNumber?: SortOrder
    shippingAddress?: SortOrder
    contactName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    note?: SortOrder
    active?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type PartnerSumOrderByAggregateInput = {
    id?: SortOrder
    version?: SortOrder
  }

  export type PartnerScalarRelationFilter = {
    is?: PartnerWhereInput
    isNot?: PartnerWhereInput
  }

  export type ShipmentEventListRelationFilter = {
    every?: ShipmentEventWhereInput
    some?: ShipmentEventWhereInput
    none?: ShipmentEventWhereInput
  }

  export type ShipmentEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ShipmentShipmentYearShipmentSequenceCompoundUniqueInput = {
    shipmentYear: number
    shipmentSequence: number
  }

  export type ShipmentCountOrderByAggregateInput = {
    id?: SortOrder
    shipmentNumber?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    shipmentDate?: SortOrder
    shippingAddress?: SortOrder
    customerOrderNumber?: SortOrder
    deliveryNoteNumber?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedBy?: SortOrder
    closedAt?: SortOrder
    shippedBy?: SortOrder
    shippedAt?: SortOrder
    voidedBy?: SortOrder
    voidedAt?: SortOrder
    voidReason?: SortOrder
    version?: SortOrder
  }

  export type ShipmentAvgOrderByAggregateInput = {
    id?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    version?: SortOrder
  }

  export type ShipmentMaxOrderByAggregateInput = {
    id?: SortOrder
    shipmentNumber?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    shipmentDate?: SortOrder
    shippingAddress?: SortOrder
    customerOrderNumber?: SortOrder
    deliveryNoteNumber?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedBy?: SortOrder
    closedAt?: SortOrder
    shippedBy?: SortOrder
    shippedAt?: SortOrder
    voidedBy?: SortOrder
    voidedAt?: SortOrder
    voidReason?: SortOrder
    version?: SortOrder
  }

  export type ShipmentMinOrderByAggregateInput = {
    id?: SortOrder
    shipmentNumber?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    shipmentDate?: SortOrder
    shippingAddress?: SortOrder
    customerOrderNumber?: SortOrder
    deliveryNoteNumber?: SortOrder
    note?: SortOrder
    status?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    closedBy?: SortOrder
    closedAt?: SortOrder
    shippedBy?: SortOrder
    shippedAt?: SortOrder
    voidedBy?: SortOrder
    voidedAt?: SortOrder
    voidReason?: SortOrder
    version?: SortOrder
  }

  export type ShipmentSumOrderByAggregateInput = {
    id?: SortOrder
    shipmentYear?: SortOrder
    shipmentSequence?: SortOrder
    partnerId?: SortOrder
    version?: SortOrder
  }

  export type ShipmentScalarRelationFilter = {
    is?: ShipmentWhereInput
    isNot?: ShipmentWhereInput
  }

  export type ShipmentItemShipmentIdLotIdCompoundUniqueInput = {
    shipmentId: bigint | number
    lotId: bigint | number
  }

  export type ShipmentItemCountOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type ShipmentItemAvgOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    version?: SortOrder
  }

  export type ShipmentItemMaxOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type ShipmentItemMinOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    version?: SortOrder
  }

  export type ShipmentItemSumOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    lotId?: SortOrder
    quantity?: SortOrder
    version?: SortOrder
  }

  export type ShipmentEventCountOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrder
    actorUserId?: SortOrder
    snapshot?: SortOrder
    createdAt?: SortOrder
  }

  export type ShipmentEventAvgOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
  }

  export type ShipmentEventMaxOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrder
    actorUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ShipmentEventMinOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
    eventType?: SortOrder
    reason?: SortOrder
    actorUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ShipmentEventSumOrderByAggregateInput = {
    id?: SortOrder
    shipmentId?: SortOrder
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type PartnerNullableScalarRelationFilter = {
    is?: PartnerWhereInput | null
    isNot?: PartnerWhereInput | null
  }

  export type AppUserCountOrderByAggregateInput = {
    userId?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    role?: SortOrder
    partnerId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppUserAvgOrderByAggregateInput = {
    partnerId?: SortOrder
  }

  export type AppUserMaxOrderByAggregateInput = {
    userId?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    role?: SortOrder
    partnerId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppUserMinOrderByAggregateInput = {
    userId?: SortOrder
    email?: SortOrder
    displayName?: SortOrder
    role?: SortOrder
    partnerId?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppUserSumOrderByAggregateInput = {
    partnerId?: SortOrder
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    beforeData?: SortOrder
    afterData?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    actorUserId?: SortOrder
    action?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    requestId?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    id?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type IdempotencyKeyCountOrderByAggregateInput = {
    key?: SortOrder
    userId?: SortOrder
    route?: SortOrder
    requestHash?: SortOrder
    responseCode?: SortOrder
    responseBody?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type IdempotencyKeyAvgOrderByAggregateInput = {
    responseCode?: SortOrder
  }

  export type IdempotencyKeyMaxOrderByAggregateInput = {
    key?: SortOrder
    userId?: SortOrder
    route?: SortOrder
    requestHash?: SortOrder
    responseCode?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type IdempotencyKeyMinOrderByAggregateInput = {
    key?: SortOrder
    userId?: SortOrder
    route?: SortOrder
    requestHash?: SortOrder
    responseCode?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type IdempotencyKeySumOrderByAggregateInput = {
    responseCode?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type LotCreateNestedManyWithoutFlavorInput = {
    create?: XOR<LotCreateWithoutFlavorInput, LotUncheckedCreateWithoutFlavorInput> | LotCreateWithoutFlavorInput[] | LotUncheckedCreateWithoutFlavorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutFlavorInput | LotCreateOrConnectWithoutFlavorInput[]
    createMany?: LotCreateManyFlavorInputEnvelope
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
  }

  export type LotUncheckedCreateNestedManyWithoutFlavorInput = {
    create?: XOR<LotCreateWithoutFlavorInput, LotUncheckedCreateWithoutFlavorInput> | LotCreateWithoutFlavorInput[] | LotUncheckedCreateWithoutFlavorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutFlavorInput | LotCreateOrConnectWithoutFlavorInput[]
    createMany?: LotCreateManyFlavorInputEnvelope
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LotUpdateManyWithoutFlavorNestedInput = {
    create?: XOR<LotCreateWithoutFlavorInput, LotUncheckedCreateWithoutFlavorInput> | LotCreateWithoutFlavorInput[] | LotUncheckedCreateWithoutFlavorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutFlavorInput | LotCreateOrConnectWithoutFlavorInput[]
    upsert?: LotUpsertWithWhereUniqueWithoutFlavorInput | LotUpsertWithWhereUniqueWithoutFlavorInput[]
    createMany?: LotCreateManyFlavorInputEnvelope
    set?: LotWhereUniqueInput | LotWhereUniqueInput[]
    disconnect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    delete?: LotWhereUniqueInput | LotWhereUniqueInput[]
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    update?: LotUpdateWithWhereUniqueWithoutFlavorInput | LotUpdateWithWhereUniqueWithoutFlavorInput[]
    updateMany?: LotUpdateManyWithWhereWithoutFlavorInput | LotUpdateManyWithWhereWithoutFlavorInput[]
    deleteMany?: LotScalarWhereInput | LotScalarWhereInput[]
  }

  export type LotUncheckedUpdateManyWithoutFlavorNestedInput = {
    create?: XOR<LotCreateWithoutFlavorInput, LotUncheckedCreateWithoutFlavorInput> | LotCreateWithoutFlavorInput[] | LotUncheckedCreateWithoutFlavorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutFlavorInput | LotCreateOrConnectWithoutFlavorInput[]
    upsert?: LotUpsertWithWhereUniqueWithoutFlavorInput | LotUpsertWithWhereUniqueWithoutFlavorInput[]
    createMany?: LotCreateManyFlavorInputEnvelope
    set?: LotWhereUniqueInput | LotWhereUniqueInput[]
    disconnect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    delete?: LotWhereUniqueInput | LotWhereUniqueInput[]
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    update?: LotUpdateWithWhereUniqueWithoutFlavorInput | LotUpdateWithWhereUniqueWithoutFlavorInput[]
    updateMany?: LotUpdateManyWithWhereWithoutFlavorInput | LotUpdateManyWithWhereWithoutFlavorInput[]
    deleteMany?: LotScalarWhereInput | LotScalarWhereInput[]
  }

  export type LotCreateNestedManyWithoutOperatorInput = {
    create?: XOR<LotCreateWithoutOperatorInput, LotUncheckedCreateWithoutOperatorInput> | LotCreateWithoutOperatorInput[] | LotUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutOperatorInput | LotCreateOrConnectWithoutOperatorInput[]
    createMany?: LotCreateManyOperatorInputEnvelope
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
  }

  export type LotUncheckedCreateNestedManyWithoutOperatorInput = {
    create?: XOR<LotCreateWithoutOperatorInput, LotUncheckedCreateWithoutOperatorInput> | LotCreateWithoutOperatorInput[] | LotUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutOperatorInput | LotCreateOrConnectWithoutOperatorInput[]
    createMany?: LotCreateManyOperatorInputEnvelope
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type LotUpdateManyWithoutOperatorNestedInput = {
    create?: XOR<LotCreateWithoutOperatorInput, LotUncheckedCreateWithoutOperatorInput> | LotCreateWithoutOperatorInput[] | LotUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutOperatorInput | LotCreateOrConnectWithoutOperatorInput[]
    upsert?: LotUpsertWithWhereUniqueWithoutOperatorInput | LotUpsertWithWhereUniqueWithoutOperatorInput[]
    createMany?: LotCreateManyOperatorInputEnvelope
    set?: LotWhereUniqueInput | LotWhereUniqueInput[]
    disconnect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    delete?: LotWhereUniqueInput | LotWhereUniqueInput[]
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    update?: LotUpdateWithWhereUniqueWithoutOperatorInput | LotUpdateWithWhereUniqueWithoutOperatorInput[]
    updateMany?: LotUpdateManyWithWhereWithoutOperatorInput | LotUpdateManyWithWhereWithoutOperatorInput[]
    deleteMany?: LotScalarWhereInput | LotScalarWhereInput[]
  }

  export type LotUncheckedUpdateManyWithoutOperatorNestedInput = {
    create?: XOR<LotCreateWithoutOperatorInput, LotUncheckedCreateWithoutOperatorInput> | LotCreateWithoutOperatorInput[] | LotUncheckedCreateWithoutOperatorInput[]
    connectOrCreate?: LotCreateOrConnectWithoutOperatorInput | LotCreateOrConnectWithoutOperatorInput[]
    upsert?: LotUpsertWithWhereUniqueWithoutOperatorInput | LotUpsertWithWhereUniqueWithoutOperatorInput[]
    createMany?: LotCreateManyOperatorInputEnvelope
    set?: LotWhereUniqueInput | LotWhereUniqueInput[]
    disconnect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    delete?: LotWhereUniqueInput | LotWhereUniqueInput[]
    connect?: LotWhereUniqueInput | LotWhereUniqueInput[]
    update?: LotUpdateWithWhereUniqueWithoutOperatorInput | LotUpdateWithWhereUniqueWithoutOperatorInput[]
    updateMany?: LotUpdateManyWithWhereWithoutOperatorInput | LotUpdateManyWithWhereWithoutOperatorInput[]
    deleteMany?: LotScalarWhereInput | LotScalarWhereInput[]
  }

  export type FlavorCreateNestedOneWithoutLotsInput = {
    create?: XOR<FlavorCreateWithoutLotsInput, FlavorUncheckedCreateWithoutLotsInput>
    connectOrCreate?: FlavorCreateOrConnectWithoutLotsInput
    connect?: FlavorWhereUniqueInput
  }

  export type OperatorCreateNestedOneWithoutLotsInput = {
    create?: XOR<OperatorCreateWithoutLotsInput, OperatorUncheckedCreateWithoutLotsInput>
    connectOrCreate?: OperatorCreateOrConnectWithoutLotsInput
    connect?: OperatorWhereUniqueInput
  }

  export type LotEventCreateNestedManyWithoutLotInput = {
    create?: XOR<LotEventCreateWithoutLotInput, LotEventUncheckedCreateWithoutLotInput> | LotEventCreateWithoutLotInput[] | LotEventUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotEventCreateOrConnectWithoutLotInput | LotEventCreateOrConnectWithoutLotInput[]
    createMany?: LotEventCreateManyLotInputEnvelope
    connect?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
  }

  export type ShipmentItemCreateNestedManyWithoutLotInput = {
    create?: XOR<ShipmentItemCreateWithoutLotInput, ShipmentItemUncheckedCreateWithoutLotInput> | ShipmentItemCreateWithoutLotInput[] | ShipmentItemUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutLotInput | ShipmentItemCreateOrConnectWithoutLotInput[]
    createMany?: ShipmentItemCreateManyLotInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type LotEventUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<LotEventCreateWithoutLotInput, LotEventUncheckedCreateWithoutLotInput> | LotEventCreateWithoutLotInput[] | LotEventUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotEventCreateOrConnectWithoutLotInput | LotEventCreateOrConnectWithoutLotInput[]
    createMany?: LotEventCreateManyLotInputEnvelope
    connect?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
  }

  export type ShipmentItemUncheckedCreateNestedManyWithoutLotInput = {
    create?: XOR<ShipmentItemCreateWithoutLotInput, ShipmentItemUncheckedCreateWithoutLotInput> | ShipmentItemCreateWithoutLotInput[] | ShipmentItemUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutLotInput | ShipmentItemCreateOrConnectWithoutLotInput[]
    createMany?: ShipmentItemCreateManyLotInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FlavorUpdateOneRequiredWithoutLotsNestedInput = {
    create?: XOR<FlavorCreateWithoutLotsInput, FlavorUncheckedCreateWithoutLotsInput>
    connectOrCreate?: FlavorCreateOrConnectWithoutLotsInput
    upsert?: FlavorUpsertWithoutLotsInput
    connect?: FlavorWhereUniqueInput
    update?: XOR<XOR<FlavorUpdateToOneWithWhereWithoutLotsInput, FlavorUpdateWithoutLotsInput>, FlavorUncheckedUpdateWithoutLotsInput>
  }

  export type OperatorUpdateOneRequiredWithoutLotsNestedInput = {
    create?: XOR<OperatorCreateWithoutLotsInput, OperatorUncheckedCreateWithoutLotsInput>
    connectOrCreate?: OperatorCreateOrConnectWithoutLotsInput
    upsert?: OperatorUpsertWithoutLotsInput
    connect?: OperatorWhereUniqueInput
    update?: XOR<XOR<OperatorUpdateToOneWithWhereWithoutLotsInput, OperatorUpdateWithoutLotsInput>, OperatorUncheckedUpdateWithoutLotsInput>
  }

  export type LotEventUpdateManyWithoutLotNestedInput = {
    create?: XOR<LotEventCreateWithoutLotInput, LotEventUncheckedCreateWithoutLotInput> | LotEventCreateWithoutLotInput[] | LotEventUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotEventCreateOrConnectWithoutLotInput | LotEventCreateOrConnectWithoutLotInput[]
    upsert?: LotEventUpsertWithWhereUniqueWithoutLotInput | LotEventUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: LotEventCreateManyLotInputEnvelope
    set?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    disconnect?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    delete?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    connect?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    update?: LotEventUpdateWithWhereUniqueWithoutLotInput | LotEventUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: LotEventUpdateManyWithWhereWithoutLotInput | LotEventUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: LotEventScalarWhereInput | LotEventScalarWhereInput[]
  }

  export type ShipmentItemUpdateManyWithoutLotNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutLotInput, ShipmentItemUncheckedCreateWithoutLotInput> | ShipmentItemCreateWithoutLotInput[] | ShipmentItemUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutLotInput | ShipmentItemCreateOrConnectWithoutLotInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutLotInput | ShipmentItemUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: ShipmentItemCreateManyLotInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutLotInput | ShipmentItemUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutLotInput | ShipmentItemUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type LotEventUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<LotEventCreateWithoutLotInput, LotEventUncheckedCreateWithoutLotInput> | LotEventCreateWithoutLotInput[] | LotEventUncheckedCreateWithoutLotInput[]
    connectOrCreate?: LotEventCreateOrConnectWithoutLotInput | LotEventCreateOrConnectWithoutLotInput[]
    upsert?: LotEventUpsertWithWhereUniqueWithoutLotInput | LotEventUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: LotEventCreateManyLotInputEnvelope
    set?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    disconnect?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    delete?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    connect?: LotEventWhereUniqueInput | LotEventWhereUniqueInput[]
    update?: LotEventUpdateWithWhereUniqueWithoutLotInput | LotEventUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: LotEventUpdateManyWithWhereWithoutLotInput | LotEventUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: LotEventScalarWhereInput | LotEventScalarWhereInput[]
  }

  export type ShipmentItemUncheckedUpdateManyWithoutLotNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutLotInput, ShipmentItemUncheckedCreateWithoutLotInput> | ShipmentItemCreateWithoutLotInput[] | ShipmentItemUncheckedCreateWithoutLotInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutLotInput | ShipmentItemCreateOrConnectWithoutLotInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutLotInput | ShipmentItemUpsertWithWhereUniqueWithoutLotInput[]
    createMany?: ShipmentItemCreateManyLotInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutLotInput | ShipmentItemUpdateWithWhereUniqueWithoutLotInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutLotInput | ShipmentItemUpdateManyWithWhereWithoutLotInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type LotCreateNestedOneWithoutEventsInput = {
    create?: XOR<LotCreateWithoutEventsInput, LotUncheckedCreateWithoutEventsInput>
    connectOrCreate?: LotCreateOrConnectWithoutEventsInput
    connect?: LotWhereUniqueInput
  }

  export type LotUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<LotCreateWithoutEventsInput, LotUncheckedCreateWithoutEventsInput>
    connectOrCreate?: LotCreateOrConnectWithoutEventsInput
    upsert?: LotUpsertWithoutEventsInput
    connect?: LotWhereUniqueInput
    update?: XOR<XOR<LotUpdateToOneWithWhereWithoutEventsInput, LotUpdateWithoutEventsInput>, LotUncheckedUpdateWithoutEventsInput>
  }

  export type ShipmentCreateNestedManyWithoutPartnerInput = {
    create?: XOR<ShipmentCreateWithoutPartnerInput, ShipmentUncheckedCreateWithoutPartnerInput> | ShipmentCreateWithoutPartnerInput[] | ShipmentUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutPartnerInput | ShipmentCreateOrConnectWithoutPartnerInput[]
    createMany?: ShipmentCreateManyPartnerInputEnvelope
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
  }

  export type AppUserCreateNestedManyWithoutPartnerInput = {
    create?: XOR<AppUserCreateWithoutPartnerInput, AppUserUncheckedCreateWithoutPartnerInput> | AppUserCreateWithoutPartnerInput[] | AppUserUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: AppUserCreateOrConnectWithoutPartnerInput | AppUserCreateOrConnectWithoutPartnerInput[]
    createMany?: AppUserCreateManyPartnerInputEnvelope
    connect?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
  }

  export type ShipmentUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<ShipmentCreateWithoutPartnerInput, ShipmentUncheckedCreateWithoutPartnerInput> | ShipmentCreateWithoutPartnerInput[] | ShipmentUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutPartnerInput | ShipmentCreateOrConnectWithoutPartnerInput[]
    createMany?: ShipmentCreateManyPartnerInputEnvelope
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
  }

  export type AppUserUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<AppUserCreateWithoutPartnerInput, AppUserUncheckedCreateWithoutPartnerInput> | AppUserCreateWithoutPartnerInput[] | AppUserUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: AppUserCreateOrConnectWithoutPartnerInput | AppUserCreateOrConnectWithoutPartnerInput[]
    createMany?: AppUserCreateManyPartnerInputEnvelope
    connect?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
  }

  export type ShipmentUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<ShipmentCreateWithoutPartnerInput, ShipmentUncheckedCreateWithoutPartnerInput> | ShipmentCreateWithoutPartnerInput[] | ShipmentUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutPartnerInput | ShipmentCreateOrConnectWithoutPartnerInput[]
    upsert?: ShipmentUpsertWithWhereUniqueWithoutPartnerInput | ShipmentUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: ShipmentCreateManyPartnerInputEnvelope
    set?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    disconnect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    delete?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    update?: ShipmentUpdateWithWhereUniqueWithoutPartnerInput | ShipmentUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: ShipmentUpdateManyWithWhereWithoutPartnerInput | ShipmentUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
  }

  export type AppUserUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<AppUserCreateWithoutPartnerInput, AppUserUncheckedCreateWithoutPartnerInput> | AppUserCreateWithoutPartnerInput[] | AppUserUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: AppUserCreateOrConnectWithoutPartnerInput | AppUserCreateOrConnectWithoutPartnerInput[]
    upsert?: AppUserUpsertWithWhereUniqueWithoutPartnerInput | AppUserUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: AppUserCreateManyPartnerInputEnvelope
    set?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    disconnect?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    delete?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    connect?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    update?: AppUserUpdateWithWhereUniqueWithoutPartnerInput | AppUserUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: AppUserUpdateManyWithWhereWithoutPartnerInput | AppUserUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: AppUserScalarWhereInput | AppUserScalarWhereInput[]
  }

  export type ShipmentUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<ShipmentCreateWithoutPartnerInput, ShipmentUncheckedCreateWithoutPartnerInput> | ShipmentCreateWithoutPartnerInput[] | ShipmentUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ShipmentCreateOrConnectWithoutPartnerInput | ShipmentCreateOrConnectWithoutPartnerInput[]
    upsert?: ShipmentUpsertWithWhereUniqueWithoutPartnerInput | ShipmentUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: ShipmentCreateManyPartnerInputEnvelope
    set?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    disconnect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    delete?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    connect?: ShipmentWhereUniqueInput | ShipmentWhereUniqueInput[]
    update?: ShipmentUpdateWithWhereUniqueWithoutPartnerInput | ShipmentUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: ShipmentUpdateManyWithWhereWithoutPartnerInput | ShipmentUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
  }

  export type AppUserUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<AppUserCreateWithoutPartnerInput, AppUserUncheckedCreateWithoutPartnerInput> | AppUserCreateWithoutPartnerInput[] | AppUserUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: AppUserCreateOrConnectWithoutPartnerInput | AppUserCreateOrConnectWithoutPartnerInput[]
    upsert?: AppUserUpsertWithWhereUniqueWithoutPartnerInput | AppUserUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: AppUserCreateManyPartnerInputEnvelope
    set?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    disconnect?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    delete?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    connect?: AppUserWhereUniqueInput | AppUserWhereUniqueInput[]
    update?: AppUserUpdateWithWhereUniqueWithoutPartnerInput | AppUserUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: AppUserUpdateManyWithWhereWithoutPartnerInput | AppUserUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: AppUserScalarWhereInput | AppUserScalarWhereInput[]
  }

  export type PartnerCreateNestedOneWithoutShipmentsInput = {
    create?: XOR<PartnerCreateWithoutShipmentsInput, PartnerUncheckedCreateWithoutShipmentsInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutShipmentsInput
    connect?: PartnerWhereUniqueInput
  }

  export type ShipmentItemCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type ShipmentEventCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
  }

  export type ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
  }

  export type ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
  }

  export type PartnerUpdateOneRequiredWithoutShipmentsNestedInput = {
    create?: XOR<PartnerCreateWithoutShipmentsInput, PartnerUncheckedCreateWithoutShipmentsInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutShipmentsInput
    upsert?: PartnerUpsertWithoutShipmentsInput
    connect?: PartnerWhereUniqueInput
    update?: XOR<XOR<PartnerUpdateToOneWithWhereWithoutShipmentsInput, PartnerUpdateWithoutShipmentsInput>, PartnerUncheckedUpdateWithoutShipmentsInput>
  }

  export type ShipmentItemUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput | ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput | ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutShipmentInput | ShipmentItemUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type ShipmentEventUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput | ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    set?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    disconnect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    delete?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    update?: ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput | ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentEventUpdateManyWithWhereWithoutShipmentInput | ShipmentEventUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
  }

  export type ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput> | ShipmentItemCreateWithoutShipmentInput[] | ShipmentItemUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentItemCreateOrConnectWithoutShipmentInput | ShipmentItemCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput | ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentItemCreateManyShipmentInputEnvelope
    set?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    disconnect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    delete?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    connect?: ShipmentItemWhereUniqueInput | ShipmentItemWhereUniqueInput[]
    update?: ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput | ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentItemUpdateManyWithWhereWithoutShipmentInput | ShipmentItemUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
  }

  export type ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput = {
    create?: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput> | ShipmentEventCreateWithoutShipmentInput[] | ShipmentEventUncheckedCreateWithoutShipmentInput[]
    connectOrCreate?: ShipmentEventCreateOrConnectWithoutShipmentInput | ShipmentEventCreateOrConnectWithoutShipmentInput[]
    upsert?: ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput | ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput[]
    createMany?: ShipmentEventCreateManyShipmentInputEnvelope
    set?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    disconnect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    delete?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    connect?: ShipmentEventWhereUniqueInput | ShipmentEventWhereUniqueInput[]
    update?: ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput | ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput[]
    updateMany?: ShipmentEventUpdateManyWithWhereWithoutShipmentInput | ShipmentEventUpdateManyWithWhereWithoutShipmentInput[]
    deleteMany?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
  }

  export type ShipmentCreateNestedOneWithoutItemsInput = {
    create?: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutItemsInput
    connect?: ShipmentWhereUniqueInput
  }

  export type LotCreateNestedOneWithoutShipmentItemsInput = {
    create?: XOR<LotCreateWithoutShipmentItemsInput, LotUncheckedCreateWithoutShipmentItemsInput>
    connectOrCreate?: LotCreateOrConnectWithoutShipmentItemsInput
    connect?: LotWhereUniqueInput
  }

  export type ShipmentUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutItemsInput
    upsert?: ShipmentUpsertWithoutItemsInput
    connect?: ShipmentWhereUniqueInput
    update?: XOR<XOR<ShipmentUpdateToOneWithWhereWithoutItemsInput, ShipmentUpdateWithoutItemsInput>, ShipmentUncheckedUpdateWithoutItemsInput>
  }

  export type LotUpdateOneRequiredWithoutShipmentItemsNestedInput = {
    create?: XOR<LotCreateWithoutShipmentItemsInput, LotUncheckedCreateWithoutShipmentItemsInput>
    connectOrCreate?: LotCreateOrConnectWithoutShipmentItemsInput
    upsert?: LotUpsertWithoutShipmentItemsInput
    connect?: LotWhereUniqueInput
    update?: XOR<XOR<LotUpdateToOneWithWhereWithoutShipmentItemsInput, LotUpdateWithoutShipmentItemsInput>, LotUncheckedUpdateWithoutShipmentItemsInput>
  }

  export type ShipmentCreateNestedOneWithoutEventsInput = {
    create?: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutEventsInput
    connect?: ShipmentWhereUniqueInput
  }

  export type ShipmentUpdateOneRequiredWithoutEventsNestedInput = {
    create?: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
    connectOrCreate?: ShipmentCreateOrConnectWithoutEventsInput
    upsert?: ShipmentUpsertWithoutEventsInput
    connect?: ShipmentWhereUniqueInput
    update?: XOR<XOR<ShipmentUpdateToOneWithWhereWithoutEventsInput, ShipmentUpdateWithoutEventsInput>, ShipmentUncheckedUpdateWithoutEventsInput>
  }

  export type PartnerCreateNestedOneWithoutUsersInput = {
    create?: XOR<PartnerCreateWithoutUsersInput, PartnerUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutUsersInput
    connect?: PartnerWhereUniqueInput
  }

  export type PartnerUpdateOneWithoutUsersNestedInput = {
    create?: XOR<PartnerCreateWithoutUsersInput, PartnerUncheckedCreateWithoutUsersInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutUsersInput
    upsert?: PartnerUpsertWithoutUsersInput
    disconnect?: PartnerWhereInput | boolean
    delete?: PartnerWhereInput | boolean
    connect?: PartnerWhereUniqueInput
    update?: XOR<XOR<PartnerUpdateToOneWithWhereWithoutUsersInput, PartnerUpdateWithoutUsersInput>, PartnerUncheckedUpdateWithoutUsersInput>
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type LotCreateWithoutFlavorInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    operator: OperatorCreateNestedOneWithoutLotsInput
    events?: LotEventCreateNestedManyWithoutLotInput
    shipmentItems?: ShipmentItemCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutFlavorInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorId: bigint | number
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    events?: LotEventUncheckedCreateNestedManyWithoutLotInput
    shipmentItems?: ShipmentItemUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutFlavorInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutFlavorInput, LotUncheckedCreateWithoutFlavorInput>
  }

  export type LotCreateManyFlavorInputEnvelope = {
    data: LotCreateManyFlavorInput | LotCreateManyFlavorInput[]
    skipDuplicates?: boolean
  }

  export type LotUpsertWithWhereUniqueWithoutFlavorInput = {
    where: LotWhereUniqueInput
    update: XOR<LotUpdateWithoutFlavorInput, LotUncheckedUpdateWithoutFlavorInput>
    create: XOR<LotCreateWithoutFlavorInput, LotUncheckedCreateWithoutFlavorInput>
  }

  export type LotUpdateWithWhereUniqueWithoutFlavorInput = {
    where: LotWhereUniqueInput
    data: XOR<LotUpdateWithoutFlavorInput, LotUncheckedUpdateWithoutFlavorInput>
  }

  export type LotUpdateManyWithWhereWithoutFlavorInput = {
    where: LotScalarWhereInput
    data: XOR<LotUpdateManyMutationInput, LotUncheckedUpdateManyWithoutFlavorInput>
  }

  export type LotScalarWhereInput = {
    AND?: LotScalarWhereInput | LotScalarWhereInput[]
    OR?: LotScalarWhereInput[]
    NOT?: LotScalarWhereInput | LotScalarWhereInput[]
    id?: BigIntFilter<"Lot"> | bigint | number
    lotNumber?: StringFilter<"Lot"> | string
    productionDate?: DateTimeFilter<"Lot"> | Date | string
    productionPeriod?: StringFilter<"Lot"> | string
    flavorCode?: StringFilter<"Lot"> | string
    sizeMl?: IntFilter<"Lot"> | number
    batchNo?: IntFilter<"Lot"> | number
    quantity?: IntFilter<"Lot"> | number
    bestBefore?: DateTimeFilter<"Lot"> | Date | string
    operatorId?: BigIntFilter<"Lot"> | bigint | number
    operatorName?: StringFilter<"Lot"> | string
    note?: StringNullableFilter<"Lot"> | string | null
    status?: StringFilter<"Lot"> | string
    createdBy?: UuidFilter<"Lot"> | string
    createdAt?: DateTimeFilter<"Lot"> | Date | string
    updatedAt?: DateTimeFilter<"Lot"> | Date | string
    voidReason?: StringNullableFilter<"Lot"> | string | null
    voidedBy?: UuidNullableFilter<"Lot"> | string | null
    voidedAt?: DateTimeNullableFilter<"Lot"> | Date | string | null
    version?: IntFilter<"Lot"> | number
  }

  export type LotCreateWithoutOperatorInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    flavor: FlavorCreateNestedOneWithoutLotsInput
    events?: LotEventCreateNestedManyWithoutLotInput
    shipmentItems?: ShipmentItemCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutOperatorInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    events?: LotEventUncheckedCreateNestedManyWithoutLotInput
    shipmentItems?: ShipmentItemUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutOperatorInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutOperatorInput, LotUncheckedCreateWithoutOperatorInput>
  }

  export type LotCreateManyOperatorInputEnvelope = {
    data: LotCreateManyOperatorInput | LotCreateManyOperatorInput[]
    skipDuplicates?: boolean
  }

  export type LotUpsertWithWhereUniqueWithoutOperatorInput = {
    where: LotWhereUniqueInput
    update: XOR<LotUpdateWithoutOperatorInput, LotUncheckedUpdateWithoutOperatorInput>
    create: XOR<LotCreateWithoutOperatorInput, LotUncheckedCreateWithoutOperatorInput>
  }

  export type LotUpdateWithWhereUniqueWithoutOperatorInput = {
    where: LotWhereUniqueInput
    data: XOR<LotUpdateWithoutOperatorInput, LotUncheckedUpdateWithoutOperatorInput>
  }

  export type LotUpdateManyWithWhereWithoutOperatorInput = {
    where: LotScalarWhereInput
    data: XOR<LotUpdateManyMutationInput, LotUncheckedUpdateManyWithoutOperatorInput>
  }

  export type FlavorCreateWithoutLotsInput = {
    code: string
    name: string
    active?: boolean
    createdAt?: Date | string
  }

  export type FlavorUncheckedCreateWithoutLotsInput = {
    code: string
    name: string
    active?: boolean
    createdAt?: Date | string
  }

  export type FlavorCreateOrConnectWithoutLotsInput = {
    where: FlavorWhereUniqueInput
    create: XOR<FlavorCreateWithoutLotsInput, FlavorUncheckedCreateWithoutLotsInput>
  }

  export type OperatorCreateWithoutLotsInput = {
    id?: bigint | number
    name: string
    active?: boolean
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type OperatorUncheckedCreateWithoutLotsInput = {
    id?: bigint | number
    name: string
    active?: boolean
    createdBy?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type OperatorCreateOrConnectWithoutLotsInput = {
    where: OperatorWhereUniqueInput
    create: XOR<OperatorCreateWithoutLotsInput, OperatorUncheckedCreateWithoutLotsInput>
  }

  export type LotEventCreateWithoutLotInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LotEventUncheckedCreateWithoutLotInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type LotEventCreateOrConnectWithoutLotInput = {
    where: LotEventWhereUniqueInput
    create: XOR<LotEventCreateWithoutLotInput, LotEventUncheckedCreateWithoutLotInput>
  }

  export type LotEventCreateManyLotInputEnvelope = {
    data: LotEventCreateManyLotInput | LotEventCreateManyLotInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentItemCreateWithoutLotInput = {
    id?: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    shipment: ShipmentCreateNestedOneWithoutItemsInput
  }

  export type ShipmentItemUncheckedCreateWithoutLotInput = {
    id?: bigint | number
    shipmentId: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type ShipmentItemCreateOrConnectWithoutLotInput = {
    where: ShipmentItemWhereUniqueInput
    create: XOR<ShipmentItemCreateWithoutLotInput, ShipmentItemUncheckedCreateWithoutLotInput>
  }

  export type ShipmentItemCreateManyLotInputEnvelope = {
    data: ShipmentItemCreateManyLotInput | ShipmentItemCreateManyLotInput[]
    skipDuplicates?: boolean
  }

  export type FlavorUpsertWithoutLotsInput = {
    update: XOR<FlavorUpdateWithoutLotsInput, FlavorUncheckedUpdateWithoutLotsInput>
    create: XOR<FlavorCreateWithoutLotsInput, FlavorUncheckedCreateWithoutLotsInput>
    where?: FlavorWhereInput
  }

  export type FlavorUpdateToOneWithWhereWithoutLotsInput = {
    where?: FlavorWhereInput
    data: XOR<FlavorUpdateWithoutLotsInput, FlavorUncheckedUpdateWithoutLotsInput>
  }

  export type FlavorUpdateWithoutLotsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FlavorUncheckedUpdateWithoutLotsInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OperatorUpsertWithoutLotsInput = {
    update: XOR<OperatorUpdateWithoutLotsInput, OperatorUncheckedUpdateWithoutLotsInput>
    create: XOR<OperatorCreateWithoutLotsInput, OperatorUncheckedCreateWithoutLotsInput>
    where?: OperatorWhereInput
  }

  export type OperatorUpdateToOneWithWhereWithoutLotsInput = {
    where?: OperatorWhereInput
    data: XOR<OperatorUpdateWithoutLotsInput, OperatorUncheckedUpdateWithoutLotsInput>
  }

  export type OperatorUpdateWithoutLotsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type OperatorUncheckedUpdateWithoutLotsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type LotEventUpsertWithWhereUniqueWithoutLotInput = {
    where: LotEventWhereUniqueInput
    update: XOR<LotEventUpdateWithoutLotInput, LotEventUncheckedUpdateWithoutLotInput>
    create: XOR<LotEventCreateWithoutLotInput, LotEventUncheckedCreateWithoutLotInput>
  }

  export type LotEventUpdateWithWhereUniqueWithoutLotInput = {
    where: LotEventWhereUniqueInput
    data: XOR<LotEventUpdateWithoutLotInput, LotEventUncheckedUpdateWithoutLotInput>
  }

  export type LotEventUpdateManyWithWhereWithoutLotInput = {
    where: LotEventScalarWhereInput
    data: XOR<LotEventUpdateManyMutationInput, LotEventUncheckedUpdateManyWithoutLotInput>
  }

  export type LotEventScalarWhereInput = {
    AND?: LotEventScalarWhereInput | LotEventScalarWhereInput[]
    OR?: LotEventScalarWhereInput[]
    NOT?: LotEventScalarWhereInput | LotEventScalarWhereInput[]
    id?: BigIntFilter<"LotEvent"> | bigint | number
    lotId?: BigIntFilter<"LotEvent"> | bigint | number
    eventType?: StringFilter<"LotEvent"> | string
    reason?: StringNullableFilter<"LotEvent"> | string | null
    actorUserId?: UuidNullableFilter<"LotEvent"> | string | null
    snapshot?: JsonFilter<"LotEvent">
    createdAt?: DateTimeFilter<"LotEvent"> | Date | string
  }

  export type ShipmentItemUpsertWithWhereUniqueWithoutLotInput = {
    where: ShipmentItemWhereUniqueInput
    update: XOR<ShipmentItemUpdateWithoutLotInput, ShipmentItemUncheckedUpdateWithoutLotInput>
    create: XOR<ShipmentItemCreateWithoutLotInput, ShipmentItemUncheckedCreateWithoutLotInput>
  }

  export type ShipmentItemUpdateWithWhereUniqueWithoutLotInput = {
    where: ShipmentItemWhereUniqueInput
    data: XOR<ShipmentItemUpdateWithoutLotInput, ShipmentItemUncheckedUpdateWithoutLotInput>
  }

  export type ShipmentItemUpdateManyWithWhereWithoutLotInput = {
    where: ShipmentItemScalarWhereInput
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyWithoutLotInput>
  }

  export type ShipmentItemScalarWhereInput = {
    AND?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
    OR?: ShipmentItemScalarWhereInput[]
    NOT?: ShipmentItemScalarWhereInput | ShipmentItemScalarWhereInput[]
    id?: BigIntFilter<"ShipmentItem"> | bigint | number
    shipmentId?: BigIntFilter<"ShipmentItem"> | bigint | number
    lotId?: BigIntFilter<"ShipmentItem"> | bigint | number
    quantity?: IntFilter<"ShipmentItem"> | number
    createdBy?: UuidFilter<"ShipmentItem"> | string
    createdAt?: DateTimeFilter<"ShipmentItem"> | Date | string
    updatedAt?: DateTimeFilter<"ShipmentItem"> | Date | string
    version?: IntFilter<"ShipmentItem"> | number
  }

  export type LotCreateWithoutEventsInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    flavor: FlavorCreateNestedOneWithoutLotsInput
    operator: OperatorCreateNestedOneWithoutLotsInput
    shipmentItems?: ShipmentItemCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutEventsInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorId: bigint | number
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    shipmentItems?: ShipmentItemUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutEventsInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutEventsInput, LotUncheckedCreateWithoutEventsInput>
  }

  export type LotUpsertWithoutEventsInput = {
    update: XOR<LotUpdateWithoutEventsInput, LotUncheckedUpdateWithoutEventsInput>
    create: XOR<LotCreateWithoutEventsInput, LotUncheckedCreateWithoutEventsInput>
    where?: LotWhereInput
  }

  export type LotUpdateToOneWithWhereWithoutEventsInput = {
    where?: LotWhereInput
    data: XOR<LotUpdateWithoutEventsInput, LotUncheckedUpdateWithoutEventsInput>
  }

  export type LotUpdateWithoutEventsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    flavor?: FlavorUpdateOneRequiredWithoutLotsNestedInput
    operator?: OperatorUpdateOneRequiredWithoutLotsNestedInput
    shipmentItems?: ShipmentItemUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutEventsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    flavorCode?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorId?: BigIntFieldUpdateOperationsInput | bigint | number
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    shipmentItems?: ShipmentItemUncheckedUpdateManyWithoutLotNestedInput
  }

  export type ShipmentCreateWithoutPartnerInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
    events?: ShipmentEventCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutPartnerInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
    events?: ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutPartnerInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutPartnerInput, ShipmentUncheckedCreateWithoutPartnerInput>
  }

  export type ShipmentCreateManyPartnerInputEnvelope = {
    data: ShipmentCreateManyPartnerInput | ShipmentCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type AppUserCreateWithoutPartnerInput = {
    userId: string
    email?: string | null
    displayName?: string | null
    role?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppUserUncheckedCreateWithoutPartnerInput = {
    userId: string
    email?: string | null
    displayName?: string | null
    role?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppUserCreateOrConnectWithoutPartnerInput = {
    where: AppUserWhereUniqueInput
    create: XOR<AppUserCreateWithoutPartnerInput, AppUserUncheckedCreateWithoutPartnerInput>
  }

  export type AppUserCreateManyPartnerInputEnvelope = {
    data: AppUserCreateManyPartnerInput | AppUserCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentUpsertWithWhereUniqueWithoutPartnerInput = {
    where: ShipmentWhereUniqueInput
    update: XOR<ShipmentUpdateWithoutPartnerInput, ShipmentUncheckedUpdateWithoutPartnerInput>
    create: XOR<ShipmentCreateWithoutPartnerInput, ShipmentUncheckedCreateWithoutPartnerInput>
  }

  export type ShipmentUpdateWithWhereUniqueWithoutPartnerInput = {
    where: ShipmentWhereUniqueInput
    data: XOR<ShipmentUpdateWithoutPartnerInput, ShipmentUncheckedUpdateWithoutPartnerInput>
  }

  export type ShipmentUpdateManyWithWhereWithoutPartnerInput = {
    where: ShipmentScalarWhereInput
    data: XOR<ShipmentUpdateManyMutationInput, ShipmentUncheckedUpdateManyWithoutPartnerInput>
  }

  export type ShipmentScalarWhereInput = {
    AND?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
    OR?: ShipmentScalarWhereInput[]
    NOT?: ShipmentScalarWhereInput | ShipmentScalarWhereInput[]
    id?: BigIntFilter<"Shipment"> | bigint | number
    shipmentNumber?: StringFilter<"Shipment"> | string
    shipmentYear?: IntFilter<"Shipment"> | number
    shipmentSequence?: IntFilter<"Shipment"> | number
    partnerId?: BigIntFilter<"Shipment"> | bigint | number
    shipmentDate?: DateTimeFilter<"Shipment"> | Date | string
    shippingAddress?: StringNullableFilter<"Shipment"> | string | null
    customerOrderNumber?: StringNullableFilter<"Shipment"> | string | null
    deliveryNoteNumber?: StringNullableFilter<"Shipment"> | string | null
    note?: StringNullableFilter<"Shipment"> | string | null
    status?: StringFilter<"Shipment"> | string
    createdBy?: UuidFilter<"Shipment"> | string
    createdAt?: DateTimeFilter<"Shipment"> | Date | string
    updatedAt?: DateTimeFilter<"Shipment"> | Date | string
    closedBy?: UuidNullableFilter<"Shipment"> | string | null
    closedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    shippedBy?: UuidNullableFilter<"Shipment"> | string | null
    shippedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    voidedBy?: UuidNullableFilter<"Shipment"> | string | null
    voidedAt?: DateTimeNullableFilter<"Shipment"> | Date | string | null
    voidReason?: StringNullableFilter<"Shipment"> | string | null
    version?: IntFilter<"Shipment"> | number
  }

  export type AppUserUpsertWithWhereUniqueWithoutPartnerInput = {
    where: AppUserWhereUniqueInput
    update: XOR<AppUserUpdateWithoutPartnerInput, AppUserUncheckedUpdateWithoutPartnerInput>
    create: XOR<AppUserCreateWithoutPartnerInput, AppUserUncheckedCreateWithoutPartnerInput>
  }

  export type AppUserUpdateWithWhereUniqueWithoutPartnerInput = {
    where: AppUserWhereUniqueInput
    data: XOR<AppUserUpdateWithoutPartnerInput, AppUserUncheckedUpdateWithoutPartnerInput>
  }

  export type AppUserUpdateManyWithWhereWithoutPartnerInput = {
    where: AppUserScalarWhereInput
    data: XOR<AppUserUpdateManyMutationInput, AppUserUncheckedUpdateManyWithoutPartnerInput>
  }

  export type AppUserScalarWhereInput = {
    AND?: AppUserScalarWhereInput | AppUserScalarWhereInput[]
    OR?: AppUserScalarWhereInput[]
    NOT?: AppUserScalarWhereInput | AppUserScalarWhereInput[]
    userId?: UuidFilter<"AppUser"> | string
    email?: StringNullableFilter<"AppUser"> | string | null
    displayName?: StringNullableFilter<"AppUser"> | string | null
    role?: StringFilter<"AppUser"> | string
    partnerId?: BigIntNullableFilter<"AppUser"> | bigint | number | null
    active?: BoolFilter<"AppUser"> | boolean
    createdAt?: DateTimeFilter<"AppUser"> | Date | string
    updatedAt?: DateTimeFilter<"AppUser"> | Date | string
  }

  export type PartnerCreateWithoutShipmentsInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    users?: AppUserCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateWithoutShipmentsInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    users?: AppUserUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerCreateOrConnectWithoutShipmentsInput = {
    where: PartnerWhereUniqueInput
    create: XOR<PartnerCreateWithoutShipmentsInput, PartnerUncheckedCreateWithoutShipmentsInput>
  }

  export type ShipmentItemCreateWithoutShipmentInput = {
    id?: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    lot: LotCreateNestedOneWithoutShipmentItemsInput
  }

  export type ShipmentItemUncheckedCreateWithoutShipmentInput = {
    id?: bigint | number
    lotId: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type ShipmentItemCreateOrConnectWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    create: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentItemCreateManyShipmentInputEnvelope = {
    data: ShipmentItemCreateManyShipmentInput | ShipmentItemCreateManyShipmentInput[]
    skipDuplicates?: boolean
  }

  export type ShipmentEventCreateWithoutShipmentInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ShipmentEventUncheckedCreateWithoutShipmentInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ShipmentEventCreateOrConnectWithoutShipmentInput = {
    where: ShipmentEventWhereUniqueInput
    create: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentEventCreateManyShipmentInputEnvelope = {
    data: ShipmentEventCreateManyShipmentInput | ShipmentEventCreateManyShipmentInput[]
    skipDuplicates?: boolean
  }

  export type PartnerUpsertWithoutShipmentsInput = {
    update: XOR<PartnerUpdateWithoutShipmentsInput, PartnerUncheckedUpdateWithoutShipmentsInput>
    create: XOR<PartnerCreateWithoutShipmentsInput, PartnerUncheckedCreateWithoutShipmentsInput>
    where?: PartnerWhereInput
  }

  export type PartnerUpdateToOneWithWhereWithoutShipmentsInput = {
    where?: PartnerWhereInput
    data: XOR<PartnerUpdateWithoutShipmentsInput, PartnerUncheckedUpdateWithoutShipmentsInput>
  }

  export type PartnerUpdateWithoutShipmentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    users?: AppUserUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateWithoutShipmentsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    users?: AppUserUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type ShipmentItemUpsertWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    update: XOR<ShipmentItemUpdateWithoutShipmentInput, ShipmentItemUncheckedUpdateWithoutShipmentInput>
    create: XOR<ShipmentItemCreateWithoutShipmentInput, ShipmentItemUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentItemUpdateWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentItemWhereUniqueInput
    data: XOR<ShipmentItemUpdateWithoutShipmentInput, ShipmentItemUncheckedUpdateWithoutShipmentInput>
  }

  export type ShipmentItemUpdateManyWithWhereWithoutShipmentInput = {
    where: ShipmentItemScalarWhereInput
    data: XOR<ShipmentItemUpdateManyMutationInput, ShipmentItemUncheckedUpdateManyWithoutShipmentInput>
  }

  export type ShipmentEventUpsertWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentEventWhereUniqueInput
    update: XOR<ShipmentEventUpdateWithoutShipmentInput, ShipmentEventUncheckedUpdateWithoutShipmentInput>
    create: XOR<ShipmentEventCreateWithoutShipmentInput, ShipmentEventUncheckedCreateWithoutShipmentInput>
  }

  export type ShipmentEventUpdateWithWhereUniqueWithoutShipmentInput = {
    where: ShipmentEventWhereUniqueInput
    data: XOR<ShipmentEventUpdateWithoutShipmentInput, ShipmentEventUncheckedUpdateWithoutShipmentInput>
  }

  export type ShipmentEventUpdateManyWithWhereWithoutShipmentInput = {
    where: ShipmentEventScalarWhereInput
    data: XOR<ShipmentEventUpdateManyMutationInput, ShipmentEventUncheckedUpdateManyWithoutShipmentInput>
  }

  export type ShipmentEventScalarWhereInput = {
    AND?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
    OR?: ShipmentEventScalarWhereInput[]
    NOT?: ShipmentEventScalarWhereInput | ShipmentEventScalarWhereInput[]
    id?: BigIntFilter<"ShipmentEvent"> | bigint | number
    shipmentId?: BigIntFilter<"ShipmentEvent"> | bigint | number
    eventType?: StringFilter<"ShipmentEvent"> | string
    reason?: StringNullableFilter<"ShipmentEvent"> | string | null
    actorUserId?: UuidNullableFilter<"ShipmentEvent"> | string | null
    snapshot?: JsonFilter<"ShipmentEvent">
    createdAt?: DateTimeFilter<"ShipmentEvent"> | Date | string
  }

  export type ShipmentCreateWithoutItemsInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    partner: PartnerCreateNestedOneWithoutShipmentsInput
    events?: ShipmentEventCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutItemsInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    partnerId: bigint | number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    events?: ShipmentEventUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutItemsInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
  }

  export type LotCreateWithoutShipmentItemsInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    flavor: FlavorCreateNestedOneWithoutLotsInput
    operator: OperatorCreateNestedOneWithoutLotsInput
    events?: LotEventCreateNestedManyWithoutLotInput
  }

  export type LotUncheckedCreateWithoutShipmentItemsInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorId: bigint | number
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
    events?: LotEventUncheckedCreateNestedManyWithoutLotInput
  }

  export type LotCreateOrConnectWithoutShipmentItemsInput = {
    where: LotWhereUniqueInput
    create: XOR<LotCreateWithoutShipmentItemsInput, LotUncheckedCreateWithoutShipmentItemsInput>
  }

  export type ShipmentUpsertWithoutItemsInput = {
    update: XOR<ShipmentUpdateWithoutItemsInput, ShipmentUncheckedUpdateWithoutItemsInput>
    create: XOR<ShipmentCreateWithoutItemsInput, ShipmentUncheckedCreateWithoutItemsInput>
    where?: ShipmentWhereInput
  }

  export type ShipmentUpdateToOneWithWhereWithoutItemsInput = {
    where?: ShipmentWhereInput
    data: XOR<ShipmentUpdateWithoutItemsInput, ShipmentUncheckedUpdateWithoutItemsInput>
  }

  export type ShipmentUpdateWithoutItemsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    partner?: PartnerUpdateOneRequiredWithoutShipmentsNestedInput
    events?: ShipmentEventUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutItemsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    partnerId?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    events?: ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type LotUpsertWithoutShipmentItemsInput = {
    update: XOR<LotUpdateWithoutShipmentItemsInput, LotUncheckedUpdateWithoutShipmentItemsInput>
    create: XOR<LotCreateWithoutShipmentItemsInput, LotUncheckedCreateWithoutShipmentItemsInput>
    where?: LotWhereInput
  }

  export type LotUpdateToOneWithWhereWithoutShipmentItemsInput = {
    where?: LotWhereInput
    data: XOR<LotUpdateWithoutShipmentItemsInput, LotUncheckedUpdateWithoutShipmentItemsInput>
  }

  export type LotUpdateWithoutShipmentItemsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    flavor?: FlavorUpdateOneRequiredWithoutLotsNestedInput
    operator?: OperatorUpdateOneRequiredWithoutLotsNestedInput
    events?: LotEventUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutShipmentItemsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    flavorCode?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorId?: BigIntFieldUpdateOperationsInput | bigint | number
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    events?: LotEventUncheckedUpdateManyWithoutLotNestedInput
  }

  export type ShipmentCreateWithoutEventsInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    partner: PartnerCreateNestedOneWithoutShipmentsInput
    items?: ShipmentItemCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentUncheckedCreateWithoutEventsInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    partnerId: bigint | number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
    items?: ShipmentItemUncheckedCreateNestedManyWithoutShipmentInput
  }

  export type ShipmentCreateOrConnectWithoutEventsInput = {
    where: ShipmentWhereUniqueInput
    create: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
  }

  export type ShipmentUpsertWithoutEventsInput = {
    update: XOR<ShipmentUpdateWithoutEventsInput, ShipmentUncheckedUpdateWithoutEventsInput>
    create: XOR<ShipmentCreateWithoutEventsInput, ShipmentUncheckedCreateWithoutEventsInput>
    where?: ShipmentWhereInput
  }

  export type ShipmentUpdateToOneWithWhereWithoutEventsInput = {
    where?: ShipmentWhereInput
    data: XOR<ShipmentUpdateWithoutEventsInput, ShipmentUncheckedUpdateWithoutEventsInput>
  }

  export type ShipmentUpdateWithoutEventsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    partner?: PartnerUpdateOneRequiredWithoutShipmentsNestedInput
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutEventsInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    partnerId?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type PartnerCreateWithoutUsersInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    shipments?: ShipmentCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateWithoutUsersInput = {
    id?: bigint | number
    name: string
    billingName?: string | null
    taxNumber?: string | null
    shippingAddress?: string | null
    contactName?: string | null
    email?: string | null
    phone?: string | null
    note?: string | null
    active?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
    shipments?: ShipmentUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerCreateOrConnectWithoutUsersInput = {
    where: PartnerWhereUniqueInput
    create: XOR<PartnerCreateWithoutUsersInput, PartnerUncheckedCreateWithoutUsersInput>
  }

  export type PartnerUpsertWithoutUsersInput = {
    update: XOR<PartnerUpdateWithoutUsersInput, PartnerUncheckedUpdateWithoutUsersInput>
    create: XOR<PartnerCreateWithoutUsersInput, PartnerUncheckedCreateWithoutUsersInput>
    where?: PartnerWhereInput
  }

  export type PartnerUpdateToOneWithWhereWithoutUsersInput = {
    where?: PartnerWhereInput
    data: XOR<PartnerUpdateWithoutUsersInput, PartnerUncheckedUpdateWithoutUsersInput>
  }

  export type PartnerUpdateWithoutUsersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    shipments?: ShipmentUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateWithoutUsersInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    name?: StringFieldUpdateOperationsInput | string
    billingName?: NullableStringFieldUpdateOperationsInput | string | null
    taxNumber?: NullableStringFieldUpdateOperationsInput | string | null
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    contactName?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    shipments?: ShipmentUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type LotCreateManyFlavorInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorId: bigint | number
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
  }

  export type LotUpdateWithoutFlavorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    operator?: OperatorUpdateOneRequiredWithoutLotsNestedInput
    events?: LotEventUpdateManyWithoutLotNestedInput
    shipmentItems?: ShipmentItemUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutFlavorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorId?: BigIntFieldUpdateOperationsInput | bigint | number
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    events?: LotEventUncheckedUpdateManyWithoutLotNestedInput
    shipmentItems?: ShipmentItemUncheckedUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateManyWithoutFlavorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorId?: BigIntFieldUpdateOperationsInput | bigint | number
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type LotCreateManyOperatorInput = {
    id?: bigint | number
    lotNumber: string
    productionDate: Date | string
    productionPeriod: string
    flavorCode: string
    sizeMl: number
    batchNo: number
    quantity: number
    bestBefore: Date | string
    operatorName: string
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    voidReason?: string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    version?: number
  }

  export type LotUpdateWithoutOperatorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    flavor?: FlavorUpdateOneRequiredWithoutLotsNestedInput
    events?: LotEventUpdateManyWithoutLotNestedInput
    shipmentItems?: ShipmentItemUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateWithoutOperatorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    flavorCode?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
    events?: LotEventUncheckedUpdateManyWithoutLotNestedInput
    shipmentItems?: ShipmentItemUncheckedUpdateManyWithoutLotNestedInput
  }

  export type LotUncheckedUpdateManyWithoutOperatorInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotNumber?: StringFieldUpdateOperationsInput | string
    productionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    productionPeriod?: StringFieldUpdateOperationsInput | string
    flavorCode?: StringFieldUpdateOperationsInput | string
    sizeMl?: IntFieldUpdateOperationsInput | number
    batchNo?: IntFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    bestBefore?: DateTimeFieldUpdateOperationsInput | Date | string
    operatorName?: StringFieldUpdateOperationsInput | string
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type LotEventCreateManyLotInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ShipmentItemCreateManyLotInput = {
    id?: bigint | number
    shipmentId: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type LotEventUpdateWithoutLotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotEventUncheckedUpdateWithoutLotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LotEventUncheckedUpdateManyWithoutLotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemUpdateWithoutLotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    shipment?: ShipmentUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ShipmentItemUncheckedUpdateWithoutLotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemUncheckedUpdateManyWithoutLotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentCreateManyPartnerInput = {
    id?: bigint | number
    shipmentNumber: string
    shipmentYear: number
    shipmentSequence: number
    shipmentDate: Date | string
    shippingAddress?: string | null
    customerOrderNumber?: string | null
    deliveryNoteNumber?: string | null
    note?: string | null
    status?: string
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    closedBy?: string | null
    closedAt?: Date | string | null
    shippedBy?: string | null
    shippedAt?: Date | string | null
    voidedBy?: string | null
    voidedAt?: Date | string | null
    voidReason?: string | null
    version?: number
  }

  export type AppUserCreateManyPartnerInput = {
    userId: string
    email?: string | null
    displayName?: string | null
    role?: string
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ShipmentUpdateWithoutPartnerInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    items?: ShipmentItemUpdateManyWithoutShipmentNestedInput
    events?: ShipmentEventUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateWithoutPartnerInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
    items?: ShipmentItemUncheckedUpdateManyWithoutShipmentNestedInput
    events?: ShipmentEventUncheckedUpdateManyWithoutShipmentNestedInput
  }

  export type ShipmentUncheckedUpdateManyWithoutPartnerInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    shipmentNumber?: StringFieldUpdateOperationsInput | string
    shipmentYear?: IntFieldUpdateOperationsInput | number
    shipmentSequence?: IntFieldUpdateOperationsInput | number
    shipmentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    shippingAddress?: NullableStringFieldUpdateOperationsInput | string | null
    customerOrderNumber?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryNoteNumber?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedBy?: NullableStringFieldUpdateOperationsInput | string | null
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shippedBy?: NullableStringFieldUpdateOperationsInput | string | null
    shippedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidedBy?: NullableStringFieldUpdateOperationsInput | string | null
    voidedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voidReason?: NullableStringFieldUpdateOperationsInput | string | null
    version?: IntFieldUpdateOperationsInput | number
  }

  export type AppUserUpdateWithoutPartnerInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppUserUncheckedUpdateWithoutPartnerInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppUserUncheckedUpdateManyWithoutPartnerInput = {
    userId?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    role?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentItemCreateManyShipmentInput = {
    id?: bigint | number
    lotId: bigint | number
    quantity: number
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
    version?: number
  }

  export type ShipmentEventCreateManyShipmentInput = {
    id?: bigint | number
    eventType: string
    reason?: string | null
    actorUserId?: string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ShipmentItemUpdateWithoutShipmentInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
    lot?: LotUpdateOneRequiredWithoutShipmentItemsNestedInput
  }

  export type ShipmentItemUncheckedUpdateWithoutShipmentInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentItemUncheckedUpdateManyWithoutShipmentInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    lotId?: BigIntFieldUpdateOperationsInput | bigint | number
    quantity?: IntFieldUpdateOperationsInput | number
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: IntFieldUpdateOperationsInput | number
  }

  export type ShipmentEventUpdateWithoutShipmentInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventUncheckedUpdateWithoutShipmentInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ShipmentEventUncheckedUpdateManyWithoutShipmentInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    eventType?: StringFieldUpdateOperationsInput | string
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    actorUserId?: NullableStringFieldUpdateOperationsInput | string | null
    snapshot?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}