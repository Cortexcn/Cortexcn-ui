// The one Bun API these scripts use; they run with `bun <file>`.
declare module "bun" {
  export const YAML: { parse(input: string): unknown };
}
