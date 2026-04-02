import { useEffect, useState } from "react";

export default function useTimer(seconds, onFinish) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time <= 0) {
      onFinish();
      return;
    }

    const interval = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return time;
}
function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}