// deno-lint-ignore-file
/**
 * A replacement for instanceof which includes an error warning when multi-realm
 * constructors are detected.
 * See: https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production
 * See: https://webpack.js.org/guides/production/
 */
export const instanceOf: (value: unknown, constructor: any) => boolean =
  /* c8 ignore next 6 */
  // FIXME: https://github.com/graphql/graphql-js/issues/2317
  function instanceOf(value: unknown, constructor: any): boolean {
        return value instanceof constructor;
      }
