function renderInline(text) {
  if (!text) return null;

  const nodes = [];
  const pattern =
    /(!\[[^\]]*]\([^)]+\)|\[[^\]]+]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith("![")) {
      const imageMatch = token.match(/^!\[([^\]]*)]\(([^)]+)\)$/);
      nodes.push(
        <img
          key={key}
          src={imageMatch?.[2] || ""}
          alt={imageMatch?.[1] || ""}
          className="my-3 max-h-80 w-full rounded-lg border border-slate-100 object-contain"
        />,
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)]\(([^)]+)\)$/);
      nodes.push(
        <a
          key={key}
          href={linkMatch?.[2] || "#"}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-600 underline-offset-2 hover:underline"
        >
          {linkMatch?.[1] || token}
        </a>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-800"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("**") || token.startsWith("__")) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={key}>{token.slice(1, -1)}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function collectList(lines, startIndex, ordered) {
  const items = [];
  let index = startIndex;
  const pattern = ordered ? /^\s*\d+\.\s+(.+)$/ : /^\s*[-*]\s+(.+)$/;

  while (index < lines.length) {
    const match = lines[index].match(pattern);
    if (!match) break;
    items.push(match[1]);
    index += 1;
  }

  return { items, nextIndex: index };
}

export default function MarkdownContent({ children, className = "" }) {
  const source = String(children || "");
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith("```")) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(
        <pre
          key={`code-${index}`}
          className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-50"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const HeadingTag = `h${Math.min(heading[1].length, 4)}`;
      blocks.push(
        <HeadingTag
          key={`heading-${index}`}
          className="font-bold text-slate-900"
        >
          {renderInline(heading[2])}
        </HeadingTag>,
      );
      index += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const { items, nextIndex } = collectList(lines, index, false);
      blocks.push(
        <ul key={`ul-${index}`} className="list-disc space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      index = nextIndex;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const { items, nextIndex } = collectList(lines, index, true);
      blocks.push(
        <ol key={`ol-${index}`} className="list-decimal space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={`${itemIndex}-${item}`}>{renderInline(item)}</li>
          ))}
        </ol>,
      );
      index = nextIndex;
      continue;
    }

    const quote = line.match(/^>\s+(.+)$/);
    if (quote) {
      blocks.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-4 border-blue-200 pl-3 text-slate-600"
        >
          {renderInline(quote[1])}
        </blockquote>,
      );
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("```") &&
      !/^(#{1,6})\s+/.test(lines[index]) &&
      !/^\s*[-*]\s+/.test(lines[index]) &&
      !/^\s*\d+\.\s+/.test(lines[index]) &&
      !/^>\s+/.test(lines[index])
    ) {
      paragraph.push(lines[index]);
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`} className="wrap-break-word">
        {renderInline(paragraph.join(" "))}
      </p>,
    );
  }

  return <div className={`markdown-content ${className}`}>{blocks}</div>;
}
