import { parseJSON } from "./lib/reader-encoding.ts";
import { stringify } from "https://deno.land/std@0.153.0/encoding/yaml.ts";

/**
 * Read stdin as YAML, then write it out to stdout as YAML.
 *
 * This does need to read the whole input into memory.
 */

const parsed = await parseJSON(Deno.stdin);
console.log(stringify(parsed as Record<string, unknown>));
