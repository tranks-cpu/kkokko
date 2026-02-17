export function vibrate(ms: number = 10): void {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
}

export function vibratePattern(pattern: number[]): void {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
