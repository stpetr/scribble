import { BehaviorSubject } from 'rxjs'

import { ShapeTool } from './shapes/types.ts'

export const shapes$ = new BehaviorSubject<ShapeTool[]>([])
