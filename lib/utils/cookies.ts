export const COOKIES = {
    SEGMENT: 'user-segment',
    EXPERIMENT: 'experiment-variant',
    USER_ID: 'user-id',
    FIRST_VISIT: 'first-visit',
} as const;

export function getCookie(name: string, cookies: string): string | undefined {
    const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? match[2] : undefined;
}

export function generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}