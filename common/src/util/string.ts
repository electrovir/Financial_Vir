const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function randomString(length: number) {
    let result = '';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export function collapseSpaces(input: string): string {
    return input
        .trim()
        .replace(/\s{2,}/g, ' ')
        .replace(/\s/g, ' ');
}
