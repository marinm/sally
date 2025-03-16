export function classes(conditions: Record<string, boolean>) {
    return Object.entries(conditions)
        .map(([key, value]) => (value ? key : ''))
        .join(' ');
}

export function timeFormat(seconds: number): string {
    const mm = Math.floor(seconds / 60.0)
        .toString()
        .padStart(2, '0');
    const ss = (seconds % 60.0).toFixed(0).toString().padStart(2, '0');

    return `${mm}:${ss}`;
}
