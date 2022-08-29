import { readAll } from "https://deno.land/std@0.153.0/streams/conversion.ts";
import { parseAll } from "https://deno.land/std@0.153.0/encoding/yaml.ts";
import { Reader } from "https://deno.land/std@0.153.0/io/types.d.ts";

/**
 * Handle readers containing structured data
 *
 * These generally can't be streamed, but taking the reader in makes for a convinient CLI abstraction
 */

/**
 * Parse a reader containing YAML
 */
export async function parseYaml(reader: Reader): Promise<unknown> {
  const data = new TextDecoder().decode(await readAll(reader));
  const docs: unknown[] = [];

  for (const x of parseAll(data) as Iterable<unknown>) {
    docs.push(x);
  }

  if (docs.length === 1) {
    return docs[0];
  } else {
    return docs;
  }
}

/**
 * Parse a reader containing JSON
 */
export async function parseJSON(reader: Reader): Promise<unknown> {
  const data = new TextDecoder().decode(await readAll(reader));
  return JSON.parse(data);
}
