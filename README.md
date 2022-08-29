# Deno Tools

Various utilities for [Deno](https://deno.land/).

## Usage

- Ideally, clone the repo, and then run `./install.sh`, which should make the
  utilities available in your shell
- These can also be run directly from the repo, e.g.

```bash
cat ./file.yaml | deno run https://raw.githubusercontent.com/metriccaution/deno-tools/main/yaml-to-json.ts | jq ".id"
```

## Tools

### JSON to YAML / YAML to JSON

- These programs read in from `stdin`, parse the file (as JSON, or YAML), and
  then write the results back to `stdout`
- This is intended for use in piping YAML files through tools like `jq`, and
  then possibly back to YAML afterwards

## Development

Run the tests using:

```bash
deno task test
```
