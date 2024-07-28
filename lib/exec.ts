/**
 * Simple wrapper around execing a file and getting standard output back out.
 */
export async function exec(cmd: string[]): Promise<string> {
  const process = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stderr, stdout } = await process.output();

  if (code !== 0) {
    throw new Error(
      `Failed to fetch DVD metadata: ${new TextDecoder().decode(stderr)}`,
    );
  }

  return new TextDecoder().decode(stdout);
}
