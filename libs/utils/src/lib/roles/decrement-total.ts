export function decrementTotal(total: number): number {
  return Math.max(total - 1, 0);
}
