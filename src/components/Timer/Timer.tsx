import { useState, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import classes from '../../helpers/classes';
import { Dot } from './types';
import { DOTS } from './constants';

function now() {
    return dayjs();
}

function dotClass(dot: Dot, iCurrent: number = -1) {
    return classes({
        dot: true,
        'dot-is-hold': ['H', 'P', '★'].includes(dot.display),
        'dot-in-progress': iCurrent == dot.i,
        'dot-is-done': iCurrent > dot.i,
    });
}

export default function Timer() {
    const [time, setTime] = useState<Dayjs | null>(now());
    const [startedAt, setStartedAt] = useState<Dayjs | null>(null);
    const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
    const audio = useRef<HTMLAudioElement>(null);

    const elapsed =
        time && startedAt ? time.diff(startedAt, 'millisecond') / 1000 : null;

    function start() {
        setStartedAt(now());
        intervalId.current = setInterval(() => setTime(now()), 100);
        audio.current?.play();
    }

    function reset() {
        if (intervalId.current != null) {
            clearInterval(intervalId.current);
        }
        intervalId.current = null;
        setTime(null);
        setStartedAt(null);

        if (audio.current) {
            audio.current.pause();
            audio.current.currentTime = 0;
        }
    }

    function onClick() {
        startedAt ? reset() : start();
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
                ref={audio}
            ></audio>
            <div>{elapsed}</div>
            <div className={classes({ dots: true })} onClick={onClick}>
                {DOTS.map((dot) => (
                    <div className={dotClass(dot, iCurrent)} key={dot.i}>
                        {dot.display}
                    </div>
                ))}
            </div>
        </>
    );
}
