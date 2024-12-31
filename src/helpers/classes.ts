function classes(conditions: Record<string, boolean>) {
    return Object.entries(conditions)
        .map(([key, value]) => (value ? key : ''))
        .join(' ');
}

export default classes;
