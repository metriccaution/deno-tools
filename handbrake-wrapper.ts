/**
 * A wrapper for `HandBrakeCLI`, which builds up a command to pick up
 * particular titles.
 */

import {
  Checkbox,
  Input,
} from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts";
import { join } from "https://deno.land/std@0.170.0/path/mod.ts";
import { exec } from "./lib/exec.ts";

const outputDir = join(Deno.env.get("HOME") || ".", "Videos");
const transcodeFrom = await diskDir(
  join("/", "media", Deno.env.get("USER") ?? "user"),
);

console.log(new Date().toISOString(), "Reading disk metadata");
const metadata = await readMetadata(transcodeFrom);
console.log(new Date().toISOString(), "Read disk metadata");
const chosenTitles = await pick(
  "Which titles to transcode?",
  (i, n) => `${n}: ${i.name} (${Math.round(i.durationMs / (1000 * 60))}) mins`,
  metadata.TitleList.map(mapTitle),
);

const titles: HandbrakeArgs[] = [];

for (const title of chosenTitles) {
  console.log(`${title.index}: ${title.name}`);
  const outputName = await Input.prompt({
    message: `What do you want to call the output file`,
  });

  const audio = title.audio.length > 1
    ? await pick(
      "Which audio",
      (i) => `${i.description} (${i.language})`,
      title.audio,
    )
    : title.audio;

  const subtitles = title.subtitles.length > 1
    ? await pick(
      "Which subtitles",
      (s) => `${s.name} - ${s.language}`,
      title.subtitles,
    )
    : title.subtitles;

  titles.push({
    name: outputName,
    title: title.index,
    audio: audio.map((a) => a.track),
    subtitles: subtitles.map((s) => s.track),
  });
}

for (const config of titles) {
  const start = Date.now();
  console.log(new Date(start).toISOString(), `Transcoding ${config.name}`);
  await handbrake(transcodeFrom, outputDir, config);
  console.log(new Date().toISOString(), `Finished in ${Date.now() - start}`);
}

console.log(new Date().toISOString(), "Done");

// Script ends

/**
 * Find the current media directory in a given directory
 */
async function diskDir(mediaDir: string): Promise<string> {
  for await (const entry of Deno.readDir(mediaDir)) {
    if (!entry.isDirectory) {
      continue;
    }

    return join(mediaDir, entry.name);
  }

  throw new Error(`No disk found in ${mediaDir}`);
}

/**
 * Cliffy wrapper around the checkbox API to chose between non-string items
 */
async function pick<T>(
  message: string,
  title: (i: T, n: number) => string,
  data: T[],
): Promise<T[]> {
  const byName: Record<string, T> = data.reduce((grouped, i, n) => {
    return {
      ...grouped,
      [title(i, n)]: i,
    };
  }, {});

  const choice = await Checkbox.prompt({
    message,
    options: Object.keys(byName),
  });

  return choice.map((i) => byName[i]);
}

interface MediaTitle {
  Index: number;
  Name: string;
  Duration: {
    Hours: number;
    Minutes: number;
    Seconds: number;
  };
  Geometry: {
    Height: number;
    Width: number;
  };
  AudioList: Array<{
    TrackNumber: number;
    Description: string;
    ChannelLayoutName: string;
    LanguageCode: string;
  }>;
  SubtitleList: Array<{
    TrackNumber: number;
    LanguageCode: string;
    SourceName: string;
  }>;
}

async function readMetadata(
  diskDir: string,
): Promise<{ TitleList: MediaTitle[] }> {
  const stdout = await exec([
    "HandBrakeCLI",
    "-i",
    diskDir,
    "--json",
    "-t",
    "-0",
  ]);

  const marker = "JSON Title Set: ";
  return JSON.parse(stdout.slice(stdout.indexOf(marker) + marker.length));
}

interface TitleMetadata {
  index: number;
  name: string;
  durationMs: number;
  resolution: {
    width: number;
    height: number;
  };
  audio: Array<{
    track: number;
    description: string;
    audio: string;
    language: string;
  }>;
  subtitles: Array<{
    track: number;
    name: string;
    language: string;
  }>;
}

function mapTitle(metadata: MediaTitle): TitleMetadata {
  return {
    index: metadata.Index,
    name: metadata.Name,
    durationMs: metadata.Duration.Hours * 1000 * 60 * 60 +
      metadata.Duration.Minutes * 1000 * 60 +
      metadata.Duration.Seconds * 1000,
    resolution: {
      height: metadata.Geometry.Height,
      width: metadata.Geometry.Width,
    },
    audio: metadata.AudioList.map((a) => ({
      track: a.TrackNumber,
      description: a.Description,
      audio: a.ChannelLayoutName,
      language: a.LanguageCode,
    })),
    subtitles: metadata.SubtitleList.map((s) => ({
      track: s.TrackNumber,
      name: s.SourceName,
      language: s.LanguageCode,
    })),
  };
}

/**
 * Arguments required for running Handbrake
 */
interface HandbrakeArgs {
  name: string;
  title: number;
  subtitles: number[];
  audio: number[];
}

/**
 * Run HandBrakeCLI on a given folder
 */
async function handbrake(
  source: string,
  destination: string,
  { title, subtitles, audio, name }: HandbrakeArgs,
): Promise<void> {
  const args: Record<string, string> = {
    "-i": source,
    "-o": join(destination, name + ".mp4"),
    "-t": `${title}`,
    "-f": "mp4",
  };

  if (subtitles.length > 0) {
    args["-s"] = subtitles.join(",");
  }

  if (audio.length > 0) {
    args["-a"] = audio.join(",");
  }

  const cmd = [
    "HandBrakeCLI",
    ...Object.entries(args).reduce((a, [k, v]) => [...a, k, v], [] as string[]),
    "-m",
  ];

  await exec(cmd);
}
