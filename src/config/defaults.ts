import type { PWAsOptions } from "../types";

export const defaultConfig: PWAsOptions = {
  name: "PWAs Astro",
  icons: {
    pwaIcon: ["icon-192x192.png", "icon-512x512.png"],
    appleIcon: [
      "apple-touch-icon.png",
      "apple-touch-icon-precomposed.png",
      "safari-pinned-tab.svg",
    ],
    appleStartup: false,
    favicons: true,
    windowsTile: true,
    yandex: true,
  },
};
