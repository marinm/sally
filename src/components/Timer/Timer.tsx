import { useState, useEffect } from 'react';
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
    const [intervalId, setIntervalId] = useState<ReturnType<
        typeof setInterval
    > | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    // Default to true. For some unknown reason, the canplaythrough event does
    // not happen on my phone.
    const [canStart, setCanStart] = useState(true);

    useEffect(() => {
        if (audio) {
            return;
        }

        const audioElement = new Audio('./bring-sally-up.mp3');
        audioElement.addEventListener('canplaythrough', () => {
            setCanStart(true);
        });
        setAudio(audioElement);
    }, []);

    const elapsed =
        time && startedAt ? time.diff(startedAt, 'millisecond') / 1000 : null;

    function start() {
        if (!canStart || !audio) {
            return;
        }
        setStartedAt(now());
        const id = setInterval(() => setTime(now()), 100);
        setIntervalId(id);
        audio.play();
    }

    function reset() {
        if (intervalId != null) {
            clearInterval(intervalId);
        }
        setIntervalId(null);
        setTime(null);
        setStartedAt(null);

        if (!audio) {
            return;
        }

        audio.pause();
        audio.currentTime = 0;
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
            <div>{elapsed}</div>
            <div
                className={classes({ dots: true, disabled: !canStart })}
                onClick={onClick}
            >
                {DOTS.map((dot) => (
                    <div className={dotClass(dot, iCurrent)} key={dot.i}>
                        {dot.display}
                    </div>
                ))}
            </div>
        </>
    );
}
