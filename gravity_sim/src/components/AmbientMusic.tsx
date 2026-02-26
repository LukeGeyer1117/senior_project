import { useEffect, useRef, useState } from "react";

const AmbientMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "freemusicforvideo-space-ambient-446647.mp3"
      );
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5; // optional
    }

    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio
        .play()
        .catch(() => {
          // Browser blocked autoplay (expected until user interaction)
        });
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
    };
  }, [playing]);

  return (
    <button 
        className="btn btn-outline btn-info m-2"    
        onClick={() => setPlaying((p) => !p)}>
        {playing ? "Pause" : "Play"} Ambient Sound
    </button>
  );
};

export default AmbientMusic;