export class SortedValueCollector {
  #count = 0
  values: string[] = []

  next(val: string): number {
    this.values.push(val)
    return ++this.#count
  }
}
