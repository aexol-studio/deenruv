export const formatPrice = (value: string | number | undefined) => {
    if (value === undefined) return '—';
    const numValue = Number(value);
    return isNaN(numValue) ? value : (numValue / 100).toFixed(2);
};
