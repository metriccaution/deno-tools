/**
 * Simple wrapper around execing a file and getting standard output back out.
 */
export async function exec(cmd: string[]): Promise<string> {
  const process = Deno.run({
    cmd,
    stdout: "piped",
    stderr: "piped",
  });

  const [{ code }, rawOutput, rawError] = await Promise.all([
    process.status(),
    process.output(),
    process.stderrOutput(),
  ]);

  if (code !== 0) {
    throw new Error(
      `Failed to fetch DVD metadata: ${new TextDecoder().decode(rawError)}`,
    );
  }

  return new TextDecoder().decode(rawOutput);
}
