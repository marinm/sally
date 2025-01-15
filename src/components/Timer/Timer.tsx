import { useState, useRef } from 'react';
import classes from '../../helpers/classes';
import { Dot } from './types';
import { DOTS } from './constants';
import Play from '../icons/Play';
import Pause from '../icons/Pause';
import Stop from '../icons/Stop';

function dotClass(dot: Dot, iCurrent: number = -1) {
    return classes({
        dot: true,
        'dot-is-hold': ['H', 'P', '★'].includes(dot.display),
        'dot-in-progress': iCurrent == dot.i,
        'dot-is-done': iCurrent > dot.i,
    });
}

export default function Timer() {
    const [intervalId, setIntervalId] = useState<ReturnType<
        typeof setInterval
    > | null>(null);
    const audio = useRef<HTMLAudioElement>(null);
    const [elapsed, setElapsed] = useState<number>(0);

    const isPaused = intervalId == null;

    const canPlay = isPaused;
    const canPause = !isPaused;
    const canStop = (audio.current?.currentTime ?? 0) != 0;

    function tick() {
        setElapsed(audio.current?.currentTime ?? 0);
    }

    function play() {
        setIntervalId(setInterval(tick, 100));
        audio.current?.play();
    }

    function stop(rewind = false) {
        if (audio.current) {
            audio.current.pause();
            audio.current.currentTime = rewind ? 0 : audio.current.currentTime;
        }

        if (rewind) {
            setElapsed(0);
        }

        if (intervalId != null) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    }

    const iNext = elapsed
        ? DOTS.findIndex((dot) => dot.startsAt >= elapsed)
        : null;

    const iCurrent = iNext ? iNext - 1 : -1;

    const mm = Math.floor(elapsed / 60.0)
        .toString()
        .padStart(2, '0');
    const ss = (elapsed % 60.0).toFixed(1).toString().padStart(4, '0');

    return (
        <>
            <audio
                src="./bring-sally-up.mp3"
                className="hidden"
                controls
                ref={audio}
            ></audio>
            <div>
                {mm}:{ss}
            </div>
            <div className={classes({ dots: true })}>
                {DOTS.map((dot) => (
                    <div className={dotClass(dot, iCurrent)} key={dot.i}>
                        {dot.display}
                    </div>
                ))}
            </div>
            <div className="btn-group">
                <button onClick={play} disabled={!canPlay}>
                    <Play />
                </button>
                <button onClick={() => stop(false)} disabled={!canPause}>
                    <Pause />
                </button>
                <button onClick={() => stop(true)} disabled={!canStop}>
                    <Stop />
                </button>
            </div>
        </>
    );
}
