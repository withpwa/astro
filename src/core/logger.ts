import type { ManifestFile } from "../types";
import { timeMsg } from "../utils/timer";
import { styler as $s } from "../utils/styler";

export function logInfo(files: ManifestFile[]) {
  const categories: { [key: string]: ManifestFile[] } = {};

  files.forEach((file) => {
    let category: string;

    if (file.filePath.includes("favicon")) {
      category = "favicons";
    } else if (
      file.filePath.includes("touch-icon") ||
      file.filePath.includes("safari")
    ) {
      category = "apple-icon";
    } else if (file.filePath.includes("startup")) {
      category = "apple-startup";
    } else if (
      file.filePath.includes("icon") ||
      file.filePath.includes("shortcut") ||
      file.filePath.includes("screenshots") ||
      file.filePath.includes("manifest.webmanifest")
    ) {
      category = "progressive-web-app";
    } else if (
      file.filePath.includes("browserconfig.xml") ||
      file.filePath.includes("mstile")
    ) {
      category = "windows-tile";
    } else if (file.filePath.includes("yandex")) {
      category = "yandex-browser";
    } else {
      category = "custom filename";
    }

    // 将文件添加到对应类别
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(file);
  });

  // 输出每个类别
  for (const [category, files] of Object.entries(categories)) {
    console.log(
      `${timeMsg()} ${$s("\u25B6", ["FgGreen"])} ${category} ${$s(`${files.length} file(s)`, ["Dim"])}`,
    );
    files.forEach((log, idx) => {
      const symbol = idx === files.length - 1 ? "\u2514\u2500" : "\u251C\u2500";
      console.log(
        `${log.createdAt}   ${$s(symbol, ["FgBlue"])} ${$s(`${log.filePath} (${log.executionTime.toFixed()}ms)`, ["Dim"])}`,
      );
    });
  }
}
