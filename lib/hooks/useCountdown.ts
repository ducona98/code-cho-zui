import { useEffect, useState } from "react";

/**
 * Hook to manage countdown timer
 * @param initialSeconds - Initial countdown seconds
 * @returns Object with countdown seconds, isActive status, start and reset functions
 */
export function useCountdown(initialSeconds: number = 60) {
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            setIsActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, seconds]);

  const start = (duration: number = initialSeconds) => {
    setSeconds(duration);
    setIsActive(true);
  };

  const reset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  return {
    seconds,
    isActive,
    start,
    reset,
  };
}

