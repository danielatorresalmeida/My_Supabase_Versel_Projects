import { Fragment, createElement } from "react";
import type { ReactNode } from "react";

const headingClasses = [
  "",
  "text-3xl font-semibold",
  "text-2xl font-semibold",
  "text-xl font-semibold",
  "text-lg font-semibold",
  "text-base font-semibold",
  "text-sm font-semibold uppercase tracking-wide",
];

const inlinePattern = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\))/g;

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const tokens = text.split(inlinePattern).filter(Boolean);

  return tokens.map((token, index) => {
    const key = `${keyPrefix}-inline-${index}`;
    const linkMatch = token.match(/^\[([^\]]+)\]\(((?:https?:\/\/|\/)[^)]+)\)$/);

    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{renderInlineMarkdown(token.slice(2, -2), `${key}-strong`)}</strong>;
    }

    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={key}>{renderInlineMarkdown(token.slice(1, -1), `${key}-em`)}</em>;
    }

    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em]" key={key}>
          {token.slice(1, -1)}
        </code>
      );
    }

    if (linkMatch) {
      const [, label, href] = linkMatch;
      return (
        <a
          className="underline underline-offset-2"
          href={href}
          key={key}
          rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
          target={href.startsWith("http") ? "_blank" : undefined}
        >
          {label}
        </a>
      );
    }

    return <Fragment key={key}>{token}</Fragment>;
  });
}

function isBlankLine(line: string) {
  return line.trim().length === 0;
}

function isHeadingLine(line: string) {
  return /^\s*#{1,6}\s+/.test(line);
}

function isListLine(line: string) {
  return /^\s*[-*]\s+/.test(line);
}

function isQuoteLine(line: string) {
  return /^\s*>\s?/.test(line);
}

function isFenceLine(line: string) {
  return line.trimStart().startsWith("```");
}

export function stripMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function excerptMarkdown(markdown: string, maxLength = 160) {
  const plainText = stripMarkdown(markdown);
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength - 1).trimEnd()}...`;
}

export function renderMarkdown(markdown: string, keyPrefix = "markdown"): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isBlankLine(line)) {
      index += 1;
      continue;
    }

    if (isFenceLine(line)) {
      index += 1;
      const codeLines: string[] = [];

      while (index < lines.length && !isFenceLine(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length && isFenceLine(lines[index])) {
        index += 1;
      }

      blocks.push(
        <pre
          className="overflow-x-auto rounded border bg-black/5 p-3 text-xs"
          key={`${keyPrefix}-code-${index}`}
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );

      continue;
    }

    const headingMatch = line.match(/^\s*(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();
      blocks.push(
        createElement(
          `h${level}`,
          {
            className: headingClasses[level],
            key: `${keyPrefix}-h-${index}`,
          },
          renderInlineMarkdown(content, `${keyPrefix}-h-${index}`)
        )
      );
      index += 1;
      continue;
    }

    if (isListLine(line)) {
      const items: string[] = [];

      while (index < lines.length && isListLine(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, "").trim());
        index += 1;
      }

      blocks.push(
        <ul className="list-disc space-y-1 pl-6" key={`${keyPrefix}-list-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={`${keyPrefix}-list-item-${itemIndex}`}>
              {renderInlineMarkdown(item, `${keyPrefix}-li-${itemIndex}`)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (isQuoteLine(line)) {
      const quoteLines: string[] = [];

      while (index < lines.length && isQuoteLine(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, "").trim());
        index += 1;
      }

      blocks.push(
        <blockquote className="border-l-2 pl-4 opacity-90" key={`${keyPrefix}-quote-${index}`}>
          {renderInlineMarkdown(quoteLines.join(" "), `${keyPrefix}-quote-${index}`)}
        </blockquote>
      );
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      !isBlankLine(lines[index]) &&
      !isFenceLine(lines[index]) &&
      !isHeadingLine(lines[index]) &&
      !isListLine(lines[index]) &&
      !isQuoteLine(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push(
      <p className="leading-7" key={`${keyPrefix}-p-${index}`}>
        {renderInlineMarkdown(paragraphLines.join(" "), `${keyPrefix}-p-${index}`)}
      </p>
    );
  }

  if (blocks.length === 0) {
    return [<p key={`${keyPrefix}-empty`}>No content yet.</p>];
  }

  return blocks;
}
