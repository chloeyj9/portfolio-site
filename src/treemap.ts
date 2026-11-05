// Lays out a treemap: each value gets a rectangle with area in proportion to it,
// kept as close to square as possible (the "squarified" layout). Returns
// positions as percentages of the box, for a box `aspect` times wider than tall.
export type Cell = { x: number; y: number; w: number; h: number };

export function squarify(values: number[], aspect = 1.3): Cell[] {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const order = values.map((v, i) => ({ v: (v / total) * aspect, i })).sort((a, b) => b.v - a.v);
  const out: Cell[] = new Array(values.length);
  let box = { x: 0, y: 0, w: aspect, h: 1 };

  const worst = (row: number[], side: number) => {
    const s = row.reduce((a, b) => a + b, 0);
    return Math.max(...row.map((r) => Math.max((side * side * r) / (s * s), (s * s) / (side * side * r))));
  };
  const place = (row: typeof order) => {
    const s = row.reduce((a, r) => a + r.v, 0);
    const vertical = box.w >= box.h; // lay the row down the short side
    const thick = vertical ? s / box.h : s / box.w;
    let at = 0;
    for (const r of row) {
      const len = r.v / thick;
      out[r.i] = vertical
        ? { x: box.x, y: box.y + at, w: thick, h: len }
        : { x: box.x + at, y: box.y, w: len, h: thick };
      at += len;
    }
    box = vertical
      ? { x: box.x + thick, y: box.y, w: box.w - thick, h: box.h }
      : { x: box.x, y: box.y + thick, w: box.w, h: box.h - thick };
  };

  let row: typeof order = [];
  for (const item of order) {
    const side = Math.min(box.w, box.h);
    const next = [...row, item];
    if (row.length && worst(next.map((r) => r.v), side) > worst(row.map((r) => r.v), side)) {
      place(row);
      row = [item];
    } else row = next;
  }
  if (row.length) place(row);
  return out.map((c) => ({ x: (c.x / aspect) * 100, y: c.y * 100, w: (c.w / aspect) * 100, h: c.h * 100 }));
}

// Mixes a hex color toward black (amount < 0) or white (amount > 0).
export function shade(hex: string, amount: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  const to = amount < 0 ? 0 : 255;
  const k = Math.abs(amount);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (to - v) * k));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
