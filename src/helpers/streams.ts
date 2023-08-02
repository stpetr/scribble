import { fromEvent, map, startWith } from 'rxjs'

export const createInputStream = (node: HTMLInputElement) => {
  return fromEvent(node, 'input')
    .pipe(
      map((e) => {
        const target = e.target as HTMLInputElement
        return target.value
      }),
      startWith(node.value)
    )
}
