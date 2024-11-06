import fs from "fs/promises";
import path from "path";
import { performance } from "perf_hooks";
import type { InputSource, PWAsFile, PWAsImage, ManifestFile } from "../types";
import type { PWAsComposeOptions } from "..";
import type { AstroIntegrationLogger } from "astro";
import type { Plugin } from 'vite';
import { processing } from "./processing";
import { normalizePath } from "../helpers";
import { styler as $s } from "../utils/styler";
import { timeMsg, formatTime } from "../utils/timer";
import { logInfo } from "./logger";

export async function createFiles(
  input: InputSource,
  options: PWAsComposeOptions,
  dist?: URL,
  logger?: AstroIntegrationLogger,
) {
  let files: ManifestFile[] = [];

  const outDir = normalizePath(options?.output?.assetsPrefix);
  const outPath = path.join(dist.pathname, outDir);
  const dest = new URL(outPath, dist);

  function createFile(responseFiles: (PWAsImage | PWAsFile | ManifestFile)[]) {
    return responseFiles.map(async (file, index) => {
      const startedAt = performance.now();
      await fs.writeFile(new URL(file.name, dest), file.contents);
      const completedAt = performance.now();
      const executionTime = completedAt - startedAt;
      // logger.info(`${file.name} (+${excutionTime.toFixed()}ms)`);
      files.push({
        id: index + files.length,
        name: file.name,
        contents: file.contents,
        filePath: path.join(outDir, file.name),
        createdAt: timeMsg(),
        executionTime,
      });
    });
  }

  const startedAt = performance.now();

  let outputIamges = options?.output?.images ?? true;
  let outputFiles = options?.output?.files ?? true;

  if (!outputIamges && !outputFiles) {
    logger.info(`output(images,files): ${$s(`false`, ["FgYellow"])}`);
  } else {
    if (outputIamges && outputFiles) {
      logger.info(`output(images,files): ${$s(`true`, ["FgYellow"])}`);
    } else {
      logger.info(
        `output(${(!outputIamges && "images") || (!outputFiles && "files")}): ${$s(`false`, ["FgYellow"])}`,
      );
    }
    logger.info(`directory: ${$s(`${dest.pathname}`, ["FgBlue"])}`);

    await fs.mkdir(dest, { recursive: true });

    logger.info("Processing source images...");
    const response = await processing(input, options);

    const processedTime = performance.now() - startedAt;
    logger.info(
      $s(`\u2713 Completed in ${formatTime(processedTime)}.`, ["FgGreen"]),
    );

    console.log(
      `\n${$s(` creating file(s) synchronously `, ["BgGreen", "FgBlack"])}`,
    );

    await Promise.all(createFile(response.images));
    await Promise.all(createFile(response.files));
    // const html = response.html;

    const totalTime = performance.now() - startedAt;

    files.sort((a, b) => a.id - b.id);

    // console.log(files)

    logInfo(files);
    console.log(
      `${timeMsg()} ${$s(`\u2713 Completed in ${formatTime(totalTime - processedTime)}`, ["FgGreen"])}\n`,
    );
    logger.info(
      `${files.length} file(s) built in ${$s(`${formatTime(totalTime)}`, ["Bright"])}`,
    );
  }
}

export async function injectHTML(
  input: InputSource,
  options: PWAsComposeOptions,
  compressHTML: boolean,
): Promise<Plugin> {

  const response = await processing(input, options);

  let htmlTags: string;
  if (compressHTML) {
    htmlTags = `${response.html.join("").replaceAll("\n", "")}`;
  } else {
    htmlTags = `\\n\\n\\n${response.html.join("\\n").replace(/(?<!\\n)\\n\\n+(?!\\n)/g, "\n")}\\n\\t`;
  }

  return {
    name: "rollup",
    enforce: "pre",
    transform(code) {
      try {
        const regex = /"/g;
        return code.replace(
          "</head>",
          `${htmlTags.replace(regex, '\\"')}</head>`,
        );
      } catch (error) {
        throw error;
      }
    },
  };
}
