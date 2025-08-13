export function getSemesterText(num: number): string {
    const roman = [
        "I", "II", "III", "IV", "V", "VI", "VII", "VIII"
    ];
    if (num < 1 || num > roman.length) return "Unknown Semester";
    return `Semester ${roman[num - 1]}`;
}