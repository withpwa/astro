import type {
  PWAsOptions,
  PlatformName,
  PWAsResponse,
  PWAsFile,
  PWAsImage,
} from "@pwaset/core";

export type { PWAsOptions, PlatformName, PWAsResponse, PWAsFile, PWAsImage };
export type Source = string | Buffer | (string | Buffer)[];
export type InputSource = Record<PlatformName, Source>;
export type Input = Source | Partial<InputSource>;

export type { ManifestFile } from "./ManifestFile";
