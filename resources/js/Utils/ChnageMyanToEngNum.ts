export const toEnglishDigits = (text: any) => {
    const myanDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
    return text.replace(/[၀-၉]/g, (s: any) => myanDigits.indexOf(s));
};