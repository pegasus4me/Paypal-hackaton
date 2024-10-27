export function calculateStreamRate(amount: string, duration: string): number {
  const totalAmount = Number(amount);
  const durationHours = Number(duration);

  // Convert duration to seconds
  const durationSeconds = durationHours * 60 * 60;

  // Calculate rate per second
  const ratePerSecond = totalAmount / durationSeconds;

  return ratePerSecond;
}

// To get current amount streamed at any time:
export function getCurrentStreamed(
  streamRate: number,
  amount: number,
  startTime: Date,
  currentTime: Date
): number {
  const elapsedSeconds = (currentTime.getTime() - startTime.getTime()) / 1000;
  const streamed = streamRate * elapsedSeconds;
  const remaining = Number(amount) - streamed;

  return remaining > 0 ? remaining : 0;
}

export function millisecondsToHours(ms: bigint) {
    const dur =  Number(ms) / 1000 / 60 / 60
    return String(dur)
}

