const DEFAULT_FONT_SIZE = 16;

export function px(value: number): string {
  return `${value / DEFAULT_FONT_SIZE}rem`;
}
