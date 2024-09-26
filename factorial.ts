export function factorial(target: number): number {
  if (target < 2) return 1;
  return target * factorial(target - 1);
}
