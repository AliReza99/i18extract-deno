export function getEmptyStringKeysOfObject(obj: Record<string, any>, parentKey = ''): string[] {
  let keys: string[] = [];
  for (const key in obj) {
    const combinedKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getEmptyStringKeysOfObject(obj[key], combinedKey));
    } else if (obj[key] === '') {
      keys.push(combinedKey);
    }
  }
  return keys;
}
