import {
  BehaviorSubject,
  fromEvent,
  map,
  withLatestFrom,
  merge
} from "rxjs"

import { createInputStream } from "./helpers.js"
import {
  canvas,
  setupCanvas,
  clearAuxCanvas,
  clearCanvas,
} from './canvas.ts'
import { PenLine } from './shapes/pen-line.ts'
import {Line} from "./shapes/line.ts"
import {Rectangle} from "./shapes/rectangle.ts"
import {Circle} from "./shapes/circle.ts"

import './styles/index.scss'

type Shapes = PenLine | Line | Rectangle | Circle

type Tool = 'pen' | 'line' | 'rect' | 'circle'

const thicknessControl = document.getElementById('range') as HTMLInputElement
const colorControl = document.getElementById('color') as HTMLInputElement
const usedColorsContainer = document.getElementById('used-colors') as HTMLDivElement
const usedColorsItemTpl = document.getElementById('used-colors-tpl') as HTMLTemplateElement
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement
const redoBtn = document.getElementById('redo-btn') as HTMLButtonElement
const penToolBtn = document.getElementById('tool-pen-btn') as HTMLButtonElement
const lineToolBtn = document.getElementById('tool-line-btn') as HTMLButtonElement
const rectToolBtn = document.getElementById('tool-rect-btn') as HTMLButtonElement
const circleToolBtn = document.getElementById('tool-circle-btn') as HTMLButtonElement

const toolsButtons = [
  penToolBtn,
  lineToolBtn,
  rectToolBtn,
  circleToolBtn,
]

const shapes$ = new BehaviorSubject<Shapes[]>([])
const colors$ = new BehaviorSubject<string[]>([])
const currentColor$ = new BehaviorSubject(colorControl.value)
const redo$ = new BehaviorSubject<Shapes[]>([])
const currentTool$ = new BehaviorSubject<Tool>('pen')

const mouseMove$ = fromEvent<MouseEvent>(canvas, 'mousemove')
const mouseDown$ = fromEvent<MouseEvent>(canvas, 'mousedown')
const mouseUp$ = fromEvent<MouseEvent>(canvas, 'mouseup')
const mouseLeave$ = fromEvent<MouseEvent>(canvas, 'mouseleave')
const thicknessInput$ = createInputStream(thicknessControl)
const usedColorsClick$ = fromEvent<MouseEvent>(usedColorsContainer, 'click')
const clearBtnClick$ = fromEvent<MouseEvent>(clearBtn, 'click')
const undoBtnClick$ = fromEvent<MouseEvent>(undoBtn, 'click')
const redoBtnClick$ = fromEvent<MouseEvent>(redoBtn, 'click')
const penToolBtnClick$ = fromEvent<MouseEvent>(penToolBtn, 'click')
const lineToolBtnClick$ = fromEvent<MouseEvent>(lineToolBtn, 'click')
const rectToolBtnClick$ = fromEvent<MouseEvent>(rectToolBtn, 'click')
const circleToolBtnClick$ = fromEvent<MouseEvent>(circleToolBtn, 'click')

const activeShape$ = new BehaviorSubject<Shapes | null>(null)

setupCanvas()

shapes$
  .subscribe((shapes) => {
    clearCanvas()
    shapes.forEach((shape) => {
      shape.render()
    })
  })

currentTool$.subscribe((currentTool) => {
  const activeClass = 'red'
  toolsButtons.forEach((btn) => btn.classList.remove(activeClass))
  if (currentTool === 'pen') {
    penToolBtn.classList.add(activeClass)
  } else if (currentTool === 'line') {
    lineToolBtn.classList.add(activeClass)
  } else if (currentTool === 'rect') {
    rectToolBtn.classList.add(activeClass)
  } else if (currentTool === 'circle') {
    circleToolBtn.classList.add(activeClass)
  }
})

redo$
  .subscribe((redo) => {
    redoBtn.disabled = redo.length === 0
  })

mouseDown$
  .pipe(
    withLatestFrom(currentTool$, thicknessInput$, currentColor$),
    map(([e, currentTool, thickness, color]) => {
      if (currentTool === 'line') {
        return new Line(e.offsetX, e.offsetY, +thickness, color)
      } else if (currentTool === 'rect') {
        return new Rectangle(e.offsetX, e.offsetY, +thickness, color)
      } else if (currentTool === 'circle') {
        return new Circle(e.offsetX, e.offsetY, +thickness, color)
      }
      return new PenLine(e.offsetX, e.offsetY, +thickness, color)
    }),
  )
  .subscribe((shape) => {
    activeShape$.next(shape)
  })

mouseMove$
  .pipe(
    withLatestFrom(activeShape$),
  )
  .subscribe(([e, activeShape]) => {
    if (activeShape) {
      activeShape.onMouseMove(e.offsetX, e.offsetY)
    }
  })

merge(mouseUp$, mouseLeave$)
  .pipe(
    withLatestFrom(activeShape$, shapes$),
  )
  .subscribe(([_, activeShape, shapes]) => {
    if (activeShape) {
      shapes$.next([...shapes, activeShape])
      activeShape$.next(null)
      clearAuxCanvas()
    }
  })

fromEvent<InputEvent>(colorControl, 'blur').pipe(
  map((e) => {
    const target = e.target as HTMLInputElement
    return target.value
  }),
  withLatestFrom(colors$)
).subscribe(([color, colors]) => {
  if (!colors.includes(color)) {
    colors$.next([...colors, color])
  }
  currentColor$.next(color)
})

penToolBtnClick$.subscribe(() => {
  currentTool$.next('pen')
})

lineToolBtnClick$.subscribe(() => {
  currentTool$.next('line')
})

rectToolBtnClick$.subscribe(() => {
  currentTool$.next('rect')
})

circleToolBtnClick$.subscribe(() => {
  currentTool$.next('circle')
})

colors$.subscribe((newColors) => {
  usedColorsContainer.textContent = ''
  newColors.forEach((el) => {
    const tplClone = usedColorsItemTpl.content.cloneNode(true) as Element
    const item = tplClone.querySelector('.used-colors__item') as HTMLSpanElement
    if (item) {
      item.style.backgroundColor = el
      item.setAttribute('data-color', el)
      usedColorsContainer.appendChild(tplClone)
    }
  })
})

usedColorsClick$.pipe(
  map((e) => {
    const target = e.target as HTMLInputElement
    const color = target.getAttribute('data-color')
    return color || null
  })
).subscribe((color) => {
  if (color) {
    currentColor$.next(color)
    colorControl.value = color
  }
})

clearBtnClick$
  .subscribe(() => {
    redo$.next([])
    shapes$.next([])
  })

undoBtnClick$
  .pipe(
    withLatestFrom(shapes$, redo$),
  )
  .subscribe(([_, strokes, redo]) => {
    const latestShape = strokes.slice(-1).pop()
    if (latestShape) {
      redo$.next([...redo, latestShape])
    }
    shapes$.next(strokes.slice(0, -1))
  })

redoBtnClick$
  .pipe(
    withLatestFrom(shapes$, redo$)
  )
  .subscribe(([_, shapes, redo]) => {
    const latestRedo = redo.slice(-1).pop()
    if (latestRedo) {
      shapes$.next([...shapes, latestRedo])
      redo$.next(redo.slice(0, -1))
    }
  })
