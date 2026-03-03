import type { Dispatch, SetStateAction } from "react"

interface PlaybackProps {
    playing: boolean;
    setPlaying: Dispatch<SetStateAction<boolean>>;
}

const PlaybackControls = ({playing, setPlaying} : PlaybackProps) => {
    return (
        <div className="flex flex-row join">
            <button className="btn btn-info btn-outline join-item" onClick={() =>  setPlaying(prev => !prev)}>
                {playing ? (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
            </button>
            <button className="btn btn-info btn-outline join-item">FF</button>
        </div>
    );
}

export default PlaybackControls;