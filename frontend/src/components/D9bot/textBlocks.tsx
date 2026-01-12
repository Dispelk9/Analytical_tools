import React from 'react';

export type TextBlock =
  | { type: 'code'; lang?: string; content: string }
  | { type: 'text'; content: string };

export function splitIntoBlocks(input: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  const re = /```([a-zA-Z0-9_-]+)?\s*\n([\s\S]*?)```/g;
  let last = 0, m: RegExpExecArray | null;

  while ((m = re.exec(input)) !== null) {
    if (m.index > last) blocks.push({ type: 'text', content: input.slice(last, m.index) });
    blocks.push({ type: 'code', lang: (m[1] || '').trim() || undefined, content: m[2] });
    last = re.lastIndex;
  }
  if (last < input.length) blocks.push({ type: 'text', content: input.slice(last) });
  return blocks;
}

export function renderRichTextBlock(text: string, keyPrefix: string): React.ReactNode[] {
  const lines = text.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    const h3 = line.match(/^\s*\*{3}\s*(.*?)\s*\*{3}\s*$/);
    if (h3) {
      nodes.push(<h3 key={`${keyPrefix}-h3-${i}`}>{h3[1]}</h3>);
      return;
    }
    const h2 = line.match(/^\s*\*{2}\s*(.*?)\s*\*{2}\s*$/);
    if (h2) {
      nodes.push(<h2 key={`${keyPrefix}-h2-${i}`}>{h2[1]}</h2>);
      return;
    }

    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    const re = /(\*\*\*[^*]+?\*\*\*|\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
    let m: RegExpExecArray | null;

    while ((m = re.exec(line)) !== null) {
      if (m.index > lastIdx) parts.push(line.slice(lastIdx, m.index));
      const token = m[0];
      const inner = token.replace(/^\*+|\*+$/g, '');

      if (token.startsWith('***')) {
        parts.push(<strong key={`${keyPrefix}-b3-${i}-${m.index}`} className="b-h3">{inner}</strong>);
      } else if (token.startsWith('**')) {
        parts.push(<strong key={`${keyPrefix}-b2-${i}-${m.index}`}>{inner}</strong>);
      } else {
        parts.push(<em key={`${keyPrefix}-em-${i}-${m.index}`}>{inner}</em>);
      }
      lastIdx = re.lastIndex;
    }
    if (lastIdx < line.length) parts.push(line.slice(lastIdx));

    const hasContent = parts.some(p => (typeof p === 'string' ? p.trim() : true));
    if (hasContent) {
      nodes.push(
        <p key={`${keyPrefix}-p-${i}`} style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
          {parts}
        </p>
      );
    }
  });

  return nodes;
}
