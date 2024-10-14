export function getRandomEmail(): string {
    return `testuser-${(new Date()).getTime()}-${Math.floor(Math.random() * 10000)}@example.com`;
}
