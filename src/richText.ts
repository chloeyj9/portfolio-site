// Turns the plain text typed in the dashboard into simple HTML:
// blank lines split paragraphs, **text** is bold, and lines starting
// with "1." or "- " become numbered or bulleted lists.
const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

export const inline = (s: string) =>
  escape(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

export function richText(s: string | null | undefined) {
  if (!s) return '';
  return s
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block.split('\n');
      if (lines.every((l) => /^\s*-\s/.test(l))) {
        return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*-\s/, ''))}</li>`).join('')}</ul>`;
      }
      if (lines.every((l) => /^\s*\d+\.\s/.test(l))) {
        return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s/, ''))}</li>`).join('')}</ol>`;
      }
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    })
    .join('');
}

export const lines = (s: string | null | undefined) => (s ?? '').split('\n').filter((l) => l.trim());
