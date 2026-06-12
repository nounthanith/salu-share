/**
 * Formats a Date object into a readable string
 * Example: "June 12, 2026"
 */
export const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

/**
 * Returns relative time (e.g., "5m ago", "2h ago", "1d ago")
 * Great for social feeds or order history updates
 */
export const getRelativeTime = (date: Date | string): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

/**
 * Specifically for your local context (Khmer time/date format)
 */
export const formatKhmerDate = (date: Date): string => {
    return date.toLocaleDateString('km-KH', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};