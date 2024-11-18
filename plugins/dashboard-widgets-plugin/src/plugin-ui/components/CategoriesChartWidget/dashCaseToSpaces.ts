export function dashCaseToSpaces(input: string | undefined): string {
    if (!input) return '';
    const spaced = input.replace(/-/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
