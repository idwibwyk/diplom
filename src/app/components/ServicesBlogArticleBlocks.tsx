import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Circle } from 'lucide-react';

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; n: number }
  | { type: 'h3'; text: string; n: number }
  | { type: 'h4'; text: string; n: number }
  | { type: 'h5'; text: string; n: number }
  | { type: 'ul'; items: string[]; variant?: 'chevron' | 'dot' }
  | { type: 'ol'; items: string[] }
  | { type: 'blockquote'; text: string }
  | { type: 'callout'; text: string }
  | { type: 'table'; header: string[]; rows: string[][] };

function isUrlLine(line: string): boolean {
  return line.startsWith('http://') || line.startsWith('https://');
}

function isTableSeparatorRow(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^-+$/.test(c));
}

/** Разбор тела статьи блога услуг в формате ## / ### / списки / таблицы (как в `servicesBlogArticlesBody`). */
export function parseStructuredArticle(raw: string): ArticleBlock[] {
  const lines = raw.split('\n').map((l) => l.trim());
  const blocks: ArticleBlock[] = [];
  let h2n = 0;
  let h3n = 0;
  let h4n = 0;
  let h5n = 0;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line) {
      i++;
      continue;
    }
    if (isUrlLine(line)) {
      i++;
      continue;
    }
    if (line.startsWith('##### ')) {
      h5n += 1;
      blocks.push({ type: 'h5', text: line.slice(6).trim(), n: h5n });
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      h4n += 1;
      blocks.push({ type: 'h4', text: line.slice(5).trim(), n: h4n });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      h3n += 1;
      blocks.push({ type: 'h3', text: line.slice(4).trim(), n: h3n });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      h2n += 1;
      blocks.push({ type: 'h2', text: line.slice(3).trim(), n: h2n });
      i++;
      continue;
    }
    if (line.startsWith('> ')) {
      blocks.push({ type: 'blockquote', text: line.slice(2).trim() });
      i++;
      continue;
    }
    if (line.startsWith('|') && line.includes('|', 1)) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i]
          .split('|')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        if (isTableSeparatorRow(cells)) {
          i++;
          continue;
        }
        rows.push(cells);
        i++;
      }
      if (rows.length >= 2) {
        blocks.push({ type: 'table', header: rows[0], rows: rows.slice(1) });
      }
      continue;
    }
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      if (items.length) blocks.push({ type: 'ul', variant: 'chevron', items });
      continue;
    }
    if (line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('* ')) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      if (items.length) blocks.push({ type: 'ul', variant: 'dot', items });
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
        items.push(lines[j].replace(/^\d+\.\s*/, '').trim());
        j++;
      }
      if (items.length >= 2) {
        blocks.push({ type: 'ol', items });
        i = j;
        continue;
      }
    }
    blocks.push({ type: 'p', text: line });
    i++;
  }
  return blocks;
}

const bodyTextClass =
  'text-[17px] leading-[1.75] text-slate-600 dark:text-slate-300 [text-indent:1.5em] my-4 text-pretty';

export function ServicesBlogArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((b, idx) => {
        const key = `${b.type}-${idx}`;
        switch (b.type) {
          case 'h2':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                className="mb-8 mt-14 flex scroll-mt-36 items-start gap-4 first:mt-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4A90E2] text-base font-bold text-white shadow-md ring-4 ring-[#4A90E2]/20 dark:ring-[#4A90E2]/30">
                  {b.n}
                </div>
                <h2 className="pt-0.5 text-2xl font-bold leading-tight text-gray-900 dark:text-gray-50 md:text-3xl">{b.text}</h2>
              </motion.div>
            );
          case 'h3':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                className="mb-5 mt-11 border-b-2 border-[#4A90E2]/25 pb-3"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="rounded-lg bg-gradient-to-br from-[#4A90E2] to-[#357ABD] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-sm">
                    Раздел {b.n}
                  </span>
                  <h3 className="text-xl font-semibold leading-snug text-[#1e3a5f] dark:text-[#b8d4f0] md:text-2xl">{b.text}</h3>
                </div>
              </motion.div>
            );
          case 'h4':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                className="mb-3 mt-8 flex items-center gap-3 border-l-[3px] border-[#4A90E2] pl-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4A90E2]/12 text-xs font-bold text-[#357ABD] dark:bg-[#4A90E2]/20 dark:text-[#9EC3EF]">
                  {b.n}
                </span>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 md:text-xl">{b.text}</h4>
              </motion.div>
            );
          case 'h5':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-16px' }}
                className="mb-2 mt-6"
              >
                <div className="inline-flex max-w-full flex-col gap-1 rounded-xl bg-gradient-to-r from-[#4A90E2]/10 to-transparent px-3 py-2 dark:from-[#4A90E2]/15">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A90E2]">Фокус {b.n}</span>
                  <h5 className="text-base font-semibold leading-snug text-gray-800 dark:text-gray-200">{b.text}</h5>
                </div>
              </motion.div>
            );
          case 'table':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                className="my-6 overflow-hidden rounded-2xl border border-[#4A90E2]/25 shadow-md dark:border-[#4A90E2]/35"
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[280px] text-left text-[15px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white">
                        {b.header.map((cell, hi) => (
                          <th key={hi} className="px-4 py-3 font-semibold">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((row, ri) => (
                        <tr
                          key={ri}
                          className={ri % 2 === 0 ? 'bg-white dark:bg-gray-800/90' : 'bg-[#F5FAFF] dark:bg-gray-800/60'}
                        >
                          {row.map((cell, ci) => (
                            <td key={ci} className="border-t border-[#4A90E2]/10 px-4 py-3 text-slate-700 dark:border-white/5 dark:text-slate-200">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          case 'ul': {
            const dot = b.variant === 'dot';
            return (
              <motion.ul
                key={key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                className={`my-5 list-none space-y-3.5 ${dot ? 'ml-0 rounded-xl border border-[#4A90E2]/15 bg-[#4A90E2]/5 py-3 pl-4 pr-3 dark:bg-[#4A90E2]/10' : 'ml-1 pl-1'}`}
              >
                {b.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[17px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {dot ? (
                      <Circle className="mt-2 h-2.5 w-2.5 shrink-0 fill-[#4A90E2] stroke-[#4A90E2] text-[#4A90E2]" aria-hidden />
                    ) : (
                      <ChevronRight className="mt-0.5 h-5 w-5 shrink-0 text-[#6BA3E8]" aria-hidden />
                    )}
                    <span className="[text-indent:0]">{item}</span>
                  </li>
                ))}
              </motion.ul>
            );
          }
          case 'ol':
            return (
              <motion.ol
                key={key}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                className="my-5 ml-2 list-decimal space-y-3 pl-6 text-[17px] leading-relaxed text-slate-600 marker:font-semibold marker:text-[#4A90E2] dark:text-slate-300"
              >
                {b.items.map((item, j) => (
                  <li key={j} className="pl-1 [text-indent:0]">
                    {item}
                  </li>
                ))}
              </motion.ol>
            );
          case 'blockquote':
            return (
              <blockquote
                key={key}
                className="my-8 rounded-r-xl border-l-4 border-[#4A90E2] bg-gradient-to-r from-[#4A90E2]/12 to-transparent px-5 py-4 text-[17px] italic leading-relaxed text-slate-700 [text-indent:1.5em] first:[text-indent:1.5em] dark:text-slate-200"
              >
                {b.text}
              </blockquote>
            );
          case 'callout':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -6 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                className="my-3 rounded-xl border border-[#4A90E2]/25 bg-gradient-to-r from-[#4A90E2]/8 to-transparent px-4 py-3 text-[17px] leading-relaxed text-slate-700 [text-indent:1.5em] dark:text-slate-200"
              >
                {b.text}
              </motion.div>
            );
          default:
            return (
              <motion.p
                key={key}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-16px' }}
                transition={{ duration: 0.22 }}
                className={bodyTextClass}
              >
                {b.text}
              </motion.p>
            );
        }
      })}
    </>
  );
}
