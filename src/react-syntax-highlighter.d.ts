/**
 * The CJS subpaths, imported with the `.js` extension Node needs to resolve
 * them. The ESM ones cannot be used: their own imports of highlight.js carry
 * no extension, which Node will not resolve.
 */
declare module "react-syntax-highlighter/dist/cjs/styles/hljs/*.js" {
  const style: Record<string, import("react").CSSProperties>;
  export default style;
}

declare module "react-syntax-highlighter/dist/cjs/languages/hljs/*.js" {
  const language: (hljs: unknown) => unknown;
  export default language;
}
