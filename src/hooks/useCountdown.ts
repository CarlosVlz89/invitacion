import { useEffect, useState } from 'react';

export interface CountdownValues {
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly isComplete: boolean;
}

function computeCountdown(targetTimestamp: number): CountdownValues {
  const difference = targetTimestamp - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
    };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isComplete: false,
  };
}

export function useCountdown(targetIsoDate: string): CountdownValues {
  const targetTimestamp = new Date(targetIsoDate).getTime();

  const [countdown, setCountdown] = useState<CountdownValues>(() =>
    computeCountdown(targetTimestamp),
  );

  useEffect(() => {
    setCountdown(computeCountdown(targetTimestamp));
    const intervalId = window.setInterval(() => {
      setCountdown(computeCountdown(targetTimestamp));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetTimestamp]);

  return countdown;
}
