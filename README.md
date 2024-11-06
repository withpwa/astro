# Overview

[![Build Status](https://github.com/withpwa/astro/actions/workflows/release.yml/badge.svg?style=flat-square)](https://github.com/withpwa/astro/actions/workflows/release.yml)
![NPM Version](https://img.shields.io/npm/v/%40pwaset%2Fastro?label=%40pwaset%2Fastro&labelColor=balck&color=light)

Effortlessly empower your Astro project with PWA capabilities.

## Installation

> This package is compatible with `astro@4.0.0` and above and only supports the latest Integrations API.

``` shell
$ npm install @pwaset/astro
```

## Setup

<details>

<summary>Getting Stared</summary>

**Step1**: Complete the required configuration with the help of JSDoc. and Make sure `// @ts-check` is turned on in `astro.config.mjs`.

```js
// @ts-check
import { defineConfig } from 'astro/config';
import pwaset from '@pwaset/astro';

export default defineConfig({
    integrations: [
        pwaset({
            name: "PWAs: Progressive Web Applications",
        })
    ]
})
```

**Step2**: Then provide at least one source image to the `src/pwa` directory, default `src/pwa/favicon.svg`.

**Step3**: `npm run build` generates PWA assets in `publicDir`


</details>

<details>
<summary>Advanced Settings</summary>

Core interfaces: `input`, `themes`, `manifest`, `icons`, `shourtcuts`, `screenshots`. For details, see JSDoc or [documentation]().

> The manifest is currently compatible with w3.org's manifest and some MS Edge manifests. If you need to extend it, please file an issue to [`@pwas/core`](https://github.com/pwa-surge/core/issues) to get the latest manifest type definition.

```js
// @ts-check
import { defineConfig } from 'astro/config';
import pwaset from '@pwaset/astro';
import { readFile } from 'fs/promises';

// https://astro.build/config
export default defineConfig({
    integrations: [
        pwaset({
            // input: ["src/pwa/favicon.svg", await readFile("src/pwa/logo.png")],
            input: {
                favicons: ["src/pwa/favicon.svg", await readFile("src/pwa/logo.png")],
                pwaIcon: ["src/pwa/logo.png", "src/pwa/logo.svg"],
                yandex: "src/pwa/shortcuts/icon-compose.png",
            },
            //
            name: "Twitter",
            themes: ["#fff", "#fff"],
            background: "#000",
            appleStatusBarStyle: "black-translucent",
            manifest: {
                name_localized: {
                    "zh-CN": { value: "推特", dir: "auto", lang: 'zh-CN' },
                    en: "Twitter"
                },
                short_name: "x",
                short_name_localized: {
                    "zh-CN": "推特",
                    en: "x"
                },
                description: "Get breaking news, politics, trending music, world events, sports scores, and the latest global news stories as they unfold - all with less data.",
                description_localized: {
                    "zh-CN": "获取突发新闻、政治、流行音乐、世界事件、体育比分以及最新的全球新闻报道 - 只需更少的数据。"
                },
                categories: ["beauty", "lifestyle", "fashion"],
                start_url: "/?utm_source=homescreen&utm_medium=shortcut",
                display_override: ["window-controls-overlay", "browser"],
                prefer_related_applications: true,
                related_applications: [
                    {
                        platform: "play",
                        url: "https://play.google.com/store/apps/details?id=com.example.app12",
                        id: "com.example.app1",
                    },
                    {
                        platform: "itunes",
                        url: "https://itunes.apple.com/app/example-app1/id123456789",
                    },
                ]
            },
            icons: {
                favicons: true,
                pwaIcon: true,
                appleIcon: true,
                appleStartup: true,
                windowsTile: true,
                yandex: true,
            },
            shortcuts: [
                {
                    name: "New post",
                    url: "/compose/post?utm_source=jumplist&utm_medium=shortcut",
                    icon: "src/pwa/shortcuts/icon-compose.png",
                }
            ],
            screenshots: [
                {
                    src: "src/pwa/screenshots/wide_2200x1650.png",
                    sizes: "1100x825",
                    form_factor: "wide",
                    platform: "webapp",
                    label: "Wide test"
                },
                {
                    src: "src/pwa/screenshots/iphone_pro_max_narrow.png",
                    form_factor: "narrow",
                    platform: "ios",
                    label: "Norow test"
                }
            ],
            manifestMaskable: true,
            loadManifestWithCredentials: true,
            cacheBustingQueryParam: 'v=1.0.0',
            output: {
                images: true,
                files: true,
                assetsPrefix: "https://www.example.com/assets/images"
            },
            version: "1.0.0"
        })
    ]
});
```
</details>


## Contributing

Submit your issues or feedback on our [GitHub](https://github.com/pwa-surge/astro/issues) channel.


## License

MIT

