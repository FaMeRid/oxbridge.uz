import { useRef, useEffect } from "react";

export default function AudioPlayer({ src, preventSeekBack = false }) {
  const audioRef = useRef();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !preventSeekBack) return;

    let maxTime = 0;
    const onTimeUpdate = () => {
      maxTime = Math.max(maxTime, audio.currentTime);
    };
    const onSeeking = () => {
      if (audio.currentTime < maxTime) audio.currentTime = maxTime;
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("seeking", onSeeking);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("seeking", onSeeking);
    };
  }, [preventSeekBack, src]);

  return (
    <div style={{ marginBottom: 20 }}>
      <audio ref={audioRef} controls>
        <source src={src} type="audio/mpeg" />
      </audio>
    </div>
  );
}