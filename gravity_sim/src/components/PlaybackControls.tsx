import type { Dispatch, SetStateAction } from "react"

interface PlaybackProps {
    playing: boolean;
    setPlaying: Dispatch<SetStateAction<boolean>>;
    speed: number;
    setSpeed: Dispatch<SetStateAction<number>>;
}

const PlaybackControls = ({playing, setPlaying, speed, setSpeed} : PlaybackProps) => {
    return (
        <div className="flex flex-row join">
            <button
                className="btn btn-info btn-outline join-item"
                onClick={() => setPlaying(prev => !prev)}
            >
                {playing ? (
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                )}
            </button>

            <div className="dropdown dropdown-top dropdown-center">
                <div tabIndex={0} role="button" className="btn btn-info btn-outline join-item">
                    {speed}x
                </div>

                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 p-2 shadow w-fit">
                    <li><a onClick={() => setSpeed(0.25)}>0.25x</a></li>
                    <li><a onClick={() => setSpeed(0.5)}>0.5x</a></li>
                    <li><a onClick={() => setSpeed(1)}>1x</a></li>
                    <li><a onClick={() => setSpeed(2)}>2x</a></li>
                    <li><a onClick={() => setSpeed(4)}>4x</a></li>
                </ul>
            </div>
        </div>
    );
}

export default PlaybackControls;