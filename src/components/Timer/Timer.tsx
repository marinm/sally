import { useState, useRef } from 'react';
import { classes, timeFormat } from '../../utils/utils';
import { Rep } from './types';
import { REPS } from './constants';
import Play from '../icons/Play';
import Pause from '../icons/Pause';
import Stop from '../icons/Stop';

function repClass(rep: Rep, repIndex: number = -1, isStarted: boolean) {
    return classes({
        rep: true,
        'rep-is-hold': rep.isHold,
        'rep-in-progress': isStarted && repIndex == rep.i,
        'rep-is-done': repIndex > rep.i,
    });
}

export default function Timer() {
    const audio = useRef<HTMLAudioElement>(null);
    const [elapsed, setElapsed] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);

    function play() {
        if (audio.current) {
            audio.current?.play();
            setIsStarted(true);
        }
    }

    function stop(rewind = false) {
        if (audio.current) {
            audio.current.pause();
            if (rewind) {
                audio.current.currentTime = 0;
                setIsStarted(false);
            }
        }
    }

    const isDone = elapsed == audio.current?.duration;

    // If no match is found, nextIndex is -1. This happens on the last rep.
    const nextRepIndex = REPS.findIndex((rep) => rep.startsAt > elapsed);
    const nextRepIndexRounded =
        nextRepIndex === -1 ? REPS.length : nextRepIndex;
    const repIndex = isDone ? nextRepIndexRounded : nextRepIndexRounded - 1;

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
            <div>
                {isDone
                    ? 'Done'
                    : (REPS[repIndex]?.display ?? 'Bring Sally Up')}
            </div>
            <div className={classes({ reps: true })}>
                {REPS.map((rep) => (
                    <div
                        className={repClass(rep, repIndex, isStarted)}
                        key={rep.i}
                    ></div>
                ))}
            </div>
            <br />
            <div>{timeFormat(elapsed)}</div>
            <div className="btn-group">
                <button onClick={() => play()} disabled={isPlaying || isDone}>
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
