import { StringReader } from "https://deno.land/std@0.153.0/io/readers.ts";
import { assertEquals } from "https://deno.land/std@0.153.0/testing/asserts.ts";
import { parseYaml } from "./reader-encoding.ts";

Deno.test("Blank string", async () => {
  const result = await parseYaml(new StringReader(``));
  assertEquals(result, []);
});

Deno.test("Single string", async () => {
  const result = await parseYaml(new StringReader(`Hello world`));
  assertEquals(result, "Hello world");
});

Deno.test("Basic object", async () => {
  const result = await parseYaml(
    new StringReader(`hello: world\nexample: data\nnested:\n  structure: true`),
  );
  assertEquals(result, {
    example: "data",
    hello: "world",
    nested: {
      structure: true,
    },
  });
});

Deno.test("An array", async () => {
  const result = await parseYaml(
    new StringReader(`- a\n- b\n- c`),
  );
  assertEquals(result, ["a", "b", "c"]);
});

Deno.test("Multi-document YAML file", async () => {
  const result = await parseYaml(
    new StringReader(`hello\n---\nworld`),
  );
  assertEquals(result, ["hello", "world"]);
});
