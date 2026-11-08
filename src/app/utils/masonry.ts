// Keep these in sync with --note-page-pad and --note-gap in your theme
const PAGE_PAD = 16;
const GAP = 12;

/** Matches the CSS breakpoint: 3 columns on wide screens, 2 on phones */
export function masonryColumnCount(): number {
  return window.innerWidth >= 768 ? 3 : 2;
}

/** Rough card height in px, based on how much text the card has */
function estimateHeight(title: string, content: string, columns: number): number {
  const usable = Math.min(window.innerWidth, 700) - PAGE_PAD * 2 - GAP * (columns - 1);
  const inner = usable / columns - 28; // card padding + border

  const titleChars = Math.max(6, Math.floor(inner / 8.2)); // 15.5px semi-bold title
  const bodyChars = Math.max(8, Math.floor(inner / 6.3));  // 13px excerpt

  // title is clamped to 2 lines, excerpt to 4 lines
  const titleLines = Math.min(2, Math.max(1, Math.ceil((title || 'Untitled').length / titleChars)));
  const bodyLines = Math.min(4, Math.ceil((content || '').length / bodyChars));

  return 61 + titleLines * 19.4 + bodyLines * 19.5;
}

/** Places each item in the shortest column. Ties go to the leftmost column. */
export function distributeMasonry<T>(
  items: T[],
  columns: number,
  text: (item: T) => { title: string; content: string }
): T[][] {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  const heights: number[] = new Array(columns).fill(0);

  for (const item of items) {
    const { title, content } = text(item);

    let target = 0;
    for (let i = 1; i < columns; i++) {
      if (heights[i] < heights[target]) target = i;
    }

    cols[target].push(item);
    heights[target] += estimateHeight(title, content, columns) + GAP;
  }
  return cols;
}