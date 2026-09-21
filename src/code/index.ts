/**
 * Syntax highlighting, kept out of the package root.
 *
 * The tokenizer is several tens of kilobytes and only a surface that renders
 * source needs it, so it lives behind the `./code` subpath. {@link CodeBlock}
 * stays in the root: it is the frame, and it carries no dependency.
 */
export * from "@/components/Highlighted";
