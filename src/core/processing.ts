import compose from "@pwaset/core";
import type { InputSource, PWAsResponse, Source, PlatformName } from "../types";
import type { PWAsComposeOptions } from "..";

async function composeIcons(
  input: Source,
  options: PWAsComposeOptions,
  iconType: keyof PWAsComposeOptions["icons"],
): Promise<PWAsResponse> {
  return await compose(input, {
    ...options,
    icons: {
      favicons: iconType === "favicons" ? options.icons.favicons : false,
      pwaIcon: iconType === "pwaIcon" ? options.icons.pwaIcon : false,
      appleIcon: iconType === "appleIcon" ? options.icons.appleIcon : false,
      appleStartup:
        iconType === "appleStartup" ? options.icons.appleStartup : false,
      windowsTile:
        iconType === "windowsTile" ? options.icons.windowsTile : false,
      yandex: iconType === "yandex" ? options.icons.yandex : false,
    },
  });
}

function mergeComposeResults(
  results: { platform: PlatformName; response: PWAsResponse }[],
): PWAsResponse {
  return results.reduce(
    (acc, { platform, response }) => {
      acc.images.push(
        ...response.images.map((image) => ({ ...image, platform })),
      );
      acc.files.push(...response.files.map((file) => ({ ...file, platform })));
      acc.html.push(...response.html);
      return acc;
    },
    { images: [], files: [], html: [] },
  );
}

export async function processing(
  input: InputSource,
  options: PWAsComposeOptions,
): Promise<PWAsResponse> {
  const platforms: PlatformName[] = [
    "favicons",
    "pwaIcon",
    "appleIcon",
    "appleStartup",
    "windowsTile",
    "yandex",
  ];
  const results = await Promise.all(
    platforms.map(async (platform) => ({
      platform,
      response: await composeIcons(input?.[platform], options, platform),
    })),
  );
  return mergeComposeResults(results);
}
