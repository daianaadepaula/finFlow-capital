import type { ReactNode } from "react";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|_[^_]+_)/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return <em key={index} className="italic opacity-80">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function parseTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export default function FormattedText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (line === "") {
      index++;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index++;
      }
      blocks.push(
        <ul key={`ul-${index}`} className="list-disc space-y-1 pl-5">
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        const row = parseTableRow(lines[index]);
        if (!row.every((cell) => /^:?-{2,}:?$/.test(cell))) {
          rows.push(row);
        }
        index++;
      }
      const [header, ...body] = rows;
      blocks.push(
        <div key={`table-${index}`} className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {header.map((cell, i) => (
                  <th key={i} className="px-3 py-2 font-semibold">{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {body.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className="px-3 py-2">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    blocks.push(<p key={`p-${index}`}>{renderInline(line)}</p>);
    index++;
  }

  return <div className="space-y-3 text-sm leading-relaxed">{blocks}</div>;
}
