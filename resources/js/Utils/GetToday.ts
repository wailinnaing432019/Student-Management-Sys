export const today = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
}).format(new Date());

// 24 December 2026
export const formatTranscriptDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(new Date(dateString));
};