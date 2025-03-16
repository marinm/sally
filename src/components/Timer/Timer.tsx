import { useState, useRef } from 'react';
import { classes, timeFormat } from '../../utils/utils';
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
    const audio = useRef<HTMLAudioElement>(null);
    const [elapsed, setElapsed] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const canPause = isPlaying;
    const canStop = !isPlaying && elapsed > 0;

    function stop(rewind = false) {
        if (audio.current) {
            audio.current.pause();
            audio.current.currentTime = rewind ? 0 : audio.current.currentTime;
        }
    }

    const iNext = elapsed
        ? DOTS.findIndex((dot) => dot.startsAt >= elapsed)
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
            <div>{timeFormat(elapsed)}</div>
            <div className={classes({ dots: true })}>
                {DOTS.map((dot) => (
                    <div className={dotClass(dot, iCurrent)} key={dot.i}>
                        {dot.display}
                    </div>
                ))}
            </div>
            <div className="btn-group">
                <button onClick={() => audio.current?.play()} disabled={false}>
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
