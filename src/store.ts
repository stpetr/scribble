import { BehaviorSubject } from 'rxjs'

import { Shape } from './shapes/types.ts'

export const shapes$ = new BehaviorSubject<Shape[]>([])
