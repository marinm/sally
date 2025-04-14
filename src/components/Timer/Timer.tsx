import { useState, useRef } from 'react';
import { classes, timeFormat } from '../../utils/utils';
import { Rep } from './types';
import { REPS } from './constants';
import Play from '../icons/Play';
import Pause from '../icons/Pause';
import Stop from '../icons/Stop';

function repClass(rep: Rep, iCurrent: number = -1) {
    return classes({
        rep: true,
        'rep-is-hold': rep.isHold,
        'rep-in-progress': iCurrent == rep.i,
        'rep-is-done': iCurrent > rep.i,
    });
}

export default function Timer() {
    const audio = useRef<HTMLAudioElement>(null);
    const [elapsed, setElapsed] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    function stop(rewind = false) {
        if (audio.current) {
            audio.current.pause();
            audio.current.currentTime = rewind ? 0 : audio.current.currentTime;
        }
    }

    const iNext = elapsed
        ? REPS.findIndex((rep) => rep.startsAt >= elapsed)
        : null;

    const iCurrent = iNext ? iNext - 1 : -1;

    return (
        <>
            <audio
                src="./bring-sally-up.mp3"
                className="hidden"
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={() => setElapsed(audio.current?.currentTime ?? 0)}
                ref={audio}
            ></audio>
            <div>{REPS[iCurrent]?.display ?? 'Bring Sally Up'}</div>
            <div className={classes({ reps: true })}>
                {REPS.map((rep) => (
                    <div className={repClass(rep, iCurrent)} key={rep.i}></div>
                ))}
            </div>
            <br />
            <div>{timeFormat(elapsed)}</div>
            <div className="btn-group">
                <button
                    onClick={() => audio.current?.play()}
                    disabled={isPlaying}
                >
                    <Play />
                </button>
                <button onClick={() => stop(false)} disabled={!isPlaying}>
                    <Pause />
                </button>
                <button
                    onClick={() => stop(true)}
                    disabled={!(isPlaying || elapsed > 0)}
                >
                    <Stop />
                </button>
            </div>
        </>
    );
}
