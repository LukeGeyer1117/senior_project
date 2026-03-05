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
        {playing ? 
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> 
        : 
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        }
    </button>
  );
};

export default AmbientMusic;