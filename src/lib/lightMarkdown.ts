import { createElement, type ReactNode } from "react";

/** 轻量 Markdown：标题、列表、段落、行内 code、fenced code。不引入解析库。 */
export function renderLightMarkdown(source: string): ReactNode {
  const blocks = splitBlocks(source.trim());
  return blocks.map((block, i) => renderBlock(block, i));
}

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "paragraph"; text: string };

function splitBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2].trim(),
      });
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, "").trim());
        i += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: "paragraph", text: para.join(" ") });
  }

  return blocks;
}

function renderBlock(block: Block, key: number): ReactNode {
  switch (block.type) {
    case "heading": {
      const tag = block.level === 1 ? "h2" : block.level === 2 ? "h3" : "h4";
      return createElement(tag, { key }, inline(block.text));
    }
    case "list":
      return createElement(
        "ul",
        { key },
        block.items.map((item, j) => createElement("li", { key: j }, inline(item))),
      );
    case "code":
      return createElement(
        "pre",
        { key, className: "article-code", "data-lang": block.lang || undefined },
        createElement("code", null, block.code),
      );
    case "paragraph":
      return createElement("p", { key }, inline(block.text));
  }
}

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(createElement("code", { key: `c-${k++}` }, m[1]));
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
