export function splitArray(a: any, count: number) {
    const parts = Math.ceil(a.length / count);
    const b: any[] = [];
    let index = 0;

    while (index < a.length) {
        const end = index + parts;
        b.push(a.slice(index, end));
        index = end;
    }

    return b;
}
export function sortArray(array, keySelector) {
    return array
      .map(item => ({ item, key: keySelector(item) }))
      .sort((a, b) => a.key - b.key)
      .map(p => p.item);
  }