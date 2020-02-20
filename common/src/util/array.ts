export function removeFromIndex<T>(array: T[], index: number): T {
    if (index > -1 && index < array.length) {
        return array.splice(index, 1)[0];
    }

    throw new Error(`Invalid index ${index} for array with length ${array.length}`);
}
