import { parseYaml } from "./lib/reader-encoding.ts";

/**
 * Read stdin as YAML, then write it out to stdout as YAML.
 *
 * This does need to read the whole input into memory.
 */

const parsed = await parseYaml(Deno.stdin);
console.log(JSON.stringify(parsed));
