export const numberToWordsPL = (n: number): string => {
    const units = [
        'zero',
        'jeden',
        'dwa',
        'trzy',
        'cztery',
        'pięć',
        'sześć',
        'siedem',
        'osiem',
        'dziewięć',
        'dziesięć',
        'jedenaście',
        'dwanaście',
        'trzynaście',
        'czternaście',
        'piętnaście',
        'szesnaście',
        'siedemnaście',
        'osiemnaście',
        'dziewiętnaście',
    ];
    const tens = [
        '',
        '',
        'dwadzieścia',
        'trzydzieści',
        'czterdzieści',
        'pięćdziesiąt',
        'sześćdziesiąt',
        'siedemdziesiąt',
        'osiemdziesiąt',
        'dziewięćdziesiąt',
    ];
    const hundreds = [
        '',
        'sto',
        'dwieście',
        'trzysta',
        'czterysta',
        'pięćset',
        'sześćset',
        'siedemset',
        'osiemset',
        'dziewięćset',
    ];
    const thousands = ['tysiąc', 'tysiące', 'tysięcy'];
    const millions = ['milion', 'miliony', 'milionów'];
    const grosze = ['grosz', 'grosze', 'groszy'];

    const convertToWords = (num: number): string => {
        if (num < 20) return units[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
        if (num < 1000)
            return hundreds[Math.floor(num / 100)] + (num % 100 !== 0 ? ' ' + convertToWords(num % 100) : '');
        if (num < 10000)
            return (
                units[Math.floor(num / 1000)] +
                ' ' +
                (Math.floor(num / 1000) > 1 ? thousands[2] : thousands[0]) +
                (num % 1000 !== 0 ? ' ' + convertToWords(num % 1000) : '')
            );
        if (num < 1000000)
            return (
                convertToWords(Math.floor(num / 1000)) +
                ' ' +
                (Math.floor(num / 1000) > 4 ? thousands[2] : thousands[1]) +
                (num % 1000 !== 0 ? ' ' + convertToWords(num % 1000) : '')
            );
        if (num < 10000000)
            return (
                units[Math.floor(num / 1000000)] +
                ' ' +
                millions[0] +
                (num % 1000000 !== 0 ? ' ' + convertToWords(num % 1000000) : '')
            );
        if (num < 1000000000)
            return (
                convertToWords(Math.floor(num / 1000000)) +
                ' ' +
                (Math.floor(num / 1000000) > 4 ? millions[2] : millions[1]) +
                (num % 1000000 !== 0 ? ' ' + convertToWords(num % 1000000) : '')
            );
        return 'Liczba jest za duża';
    };

    const integerPart = Math.floor(n);
    const decimalPart = Math.round((n - integerPart) * 100);

    const integerWords = convertToWords(integerPart);
    const decimalWords =
        decimalPart !== 0
            ? convertToWords(decimalPart) + ' ' + grosze[decimalPart === 1 ? 0 : decimalPart < 5 ? 1 : 2]
            : '';

    return integerWords + ' złotych' + (decimalPart !== 0 ? ' i ' + decimalWords : '');
};
