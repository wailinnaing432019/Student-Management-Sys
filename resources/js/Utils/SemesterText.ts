export function getSemesterText(num: number): string {
    const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

    if (num >= 1 && num <= roman.length) {
        return `Semester ${roman[num - 1]}`;
    }

    // Handle modules
    const moduleMap: Record<number, string> = {
        11: "Module I",
        12: "Module II",
        13: "Module III",
        14: "Module IV",
    };

    if (num in moduleMap) {
        return moduleMap[num];
    }

    return "Unknown Module";
}