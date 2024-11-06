import type { InputSource, PlatformName, Source, Input } from "./types";

function isSource(value: any): value is Source {
  if (typeof value === "string" || Buffer.isBuffer(value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(
      (item) => typeof item === "string" || Buffer.isBuffer(item),
    );
  }
  return false;
}

export function getInput(input: Input): InputSource {
  const defaultSource: Source = "src/pwa/favicon.svg";

  const defaults: InputSource = {
    favicons: defaultSource,
    pwaIcon: defaultSource,
    appleIcon: defaultSource,
    appleStartup: defaultSource,
    windowsTile: defaultSource,
    yandex: defaultSource,
  };

  if (!input) {
    return defaults;
  }

  if (isSource(input)) {
    return Object.fromEntries(
      Object.keys(defaults).map((key) => [key, input]),
    ) as InputSource;
  }

  // 组合已定义的值
  const unionSource: Source[] = Object.entries(input)
    .filter(([_, value]) => value !== undefined) // 过滤掉未定义的值
    .flatMap(([_, value]) => value); // 将剩余的值合并为数组

  // 创建结果对象并确保未定义的键使用 unionSource
  const result: InputSource = {} as InputSource;

  for (const key of Object.keys(defaults) as Array<PlatformName>) {
    // @ts-expect-error
    result[key] = input[key] !== undefined ? input[key]! : unionSource;
  }

  return result;
}

export function normalizePath(prefix: string | undefined): string {
  if (!prefix) return "/";
  try {
    const url = new URL(prefix);
    return url.pathname.replace(/\/+$/, "") + "/";
  } catch {
    return "/" + prefix.replace(/^\/+|\/+$/g, "") + "/";
  }
}
