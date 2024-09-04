export const groupBy = <K, V>(array: V[], grouper: (item: V) => K) => {
  return Array.from(array.reduce((store, item) => {
    const key = grouper(item)
    const json = JSON.stringify(key)
  
    if (!store.has(json)) {
      store.set(json, [item])
    } else {
      store.get(json)?.push(item)
    }
    return store
  }, new Map<string, V[]>()))
    .map(([key, value]) => { 
        return { key: JSON.parse(key) as K, value: value } 
    });
}