import type { AstroConfig, AstroIntegration } from "astro";
import type { PWAsOptions, Input, InputSource } from "./types";
import { defaultConfig } from "./config/defaults";
import { getInput } from "./helpers";
import { createFiles, injectHTML } from "./core";

export interface PWAsComposeOptions extends PWAsOptions {
  /**
   * @description
   * Specify the source image(s) used to generate platform-specific assets.
   * Defaults to `src/pwa/icon.svg`. Accepts a `string`, `Buffer`, or an array of `string` | `Buffer`,
   * or allows setting a unique source for each platform.
   *
   * @example
   * ```js
   * input: {
   *  pwaIcon: ["src/pwa/icon.svg", readFile("src/pwa/icon.png")]
   * }
   * ```
   */
  input?: Input;
}

export default function PWAsCompose(
  options?: PWAsComposeOptions,
): AstroIntegration {
  let config: AstroConfig;

  let sources: InputSource, dest: URL, compress: boolean;
  const mergedConfig = { ...defaultConfig, ...options };

  return {
    name: "@pwaset/astro",
    hooks: {
      "astro:config:setup": async ({ config: cfg, updateConfig }) => {
        config = cfg;
        dest = config.publicDir;
        compress = config.compressHTML;
        sources = getInput(mergedConfig?.input);

        // console.log(sources)
        updateConfig({
          vite: {
            plugins: [await injectHTML(sources, mergedConfig, compress)],
          },
        });
      },
      "astro:build:start": async ({ logger }) => {
        await createFiles(sources, mergedConfig, dest, logger);
      },
    },
  };
}
